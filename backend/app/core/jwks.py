import logging
import threading
import time
from typing import Any

import httpx
from fastapi import HTTPException, status

from .config import settings

logger = logging.getLogger(__name__)


class IdPUnavailableError(HTTPException):
    """Raised when the Keycloak JWKS endpoint is unreachable or returns an error."""

    def __init__(self, message: str = "Identity provider is currently unavailable"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"code": "IDP_UNAVAILABLE", "message": message},
        )
        self.code = "IDP_UNAVAILABLE"
        self.message = message


class JWKKeyNotFoundError(HTTPException):
    """Raised when a specific kid cannot be found in JWKS."""

    def __init__(self, message: str = "Signing key not found in JWKS"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "TOKEN_INVALID", "message": message},
            headers={"WWW-Authenticate": "Bearer"},
        )
        self.code = "TOKEN_INVALID"
        self.message = message


class JWKSClient:
    """Thread-safe JWKS client that caches public keys in-memory.

    Refetches on cache TTL expiry, or refetches at most once on unknown kid (with a cooldown
    to guard against DoS). Maps network/IdP outages directly to HTTP 503.
    """

    def __init__(
        self,
        jwks_url: str | None = None,
        cache_ttl: int | None = None,
        timeout: float = 5.0,
        min_refetch_cooldown: float = 10.0,
    ) -> None:
        self._custom_jwks_url = jwks_url
        self._custom_cache_ttl = cache_ttl
        self.timeout = timeout
        self.min_refetch_cooldown = min_refetch_cooldown

        self._keys: dict[str, dict[str, Any]] = {}
        self._last_fetch: float = 0.0
        self._lock = threading.Lock()

    @property
    def jwks_url(self) -> str:
        return self._custom_jwks_url or settings.keycloak_jwks_url

    @property
    def cache_ttl(self) -> int:
        return (
            self._custom_cache_ttl
            if self._custom_cache_ttl is not None
            else settings.KEYCLOAK_JWKS_CACHE_SECONDS
        )

    def _fetch_jwks(self) -> None:
        """Fetch keys from Keycloak JWKS endpoint. Must be called while holding self._lock."""
        url = self.jwks_url
        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(url)
                response.raise_for_status()
                data = response.json()
        except (httpx.RequestError, httpx.HTTPStatusError, Exception) as exc:
            logger.error("Failed to fetch JWKS from %s: %s", url, exc)
            raise IdPUnavailableError(
                f"Failed to fetch JWKS from identity provider: {exc}"
            ) from exc

        keys_dict: dict[str, dict[str, Any]] = {}
        for key in data.get("keys", []):
            kid = key.get("kid")
            if kid:
                keys_dict[kid] = key

        self._keys = keys_dict
        self._last_fetch = time.time()
        logger.info("Successfully fetched and cached %d keys from JWKS", len(self._keys))

    def get_key(self, kid: str) -> dict[str, Any]:
        """Retrieve key for the given kid. Thread-safe with cache TTL and single in-flight refresh."""
        if not kid:
            raise JWKKeyNotFoundError("Key ID (kid) missing from token header")

        now = time.time()
        with self._lock:
            # Check if cache is expired or empty
            cache_expired = (now - self._last_fetch) >= self.cache_ttl
            if not self._keys or cache_expired:
                self._fetch_jwks()

            if kid in self._keys:
                return self._keys[kid]

            # Cache miss: kid is not in self._keys.
            # Only refetch once if we haven't fetched recently (guard against DoS flood)
            time_since_fetch = time.time() - self._last_fetch
            if time_since_fetch >= self.min_refetch_cooldown:
                logger.info("Unknown kid '%s', attempting one JWKS refresh", kid)
                self._fetch_jwks()
                if kid in self._keys:
                    return self._keys[kid]

            # Kid still not found after allowed refresh
            raise JWKKeyNotFoundError(f"Signing key with kid '{kid}' not found in JWKS")

    def set_cached_keys(self, keys: dict[str, dict[str, Any]]) -> None:
        """Utility for test suites to inject cached keys directly."""
        with self._lock:
            self._keys = dict(keys)
            self._last_fetch = time.time()

    def reset_cache(self) -> None:
        """Reset internal key cache (primarily for test teardown)."""
        with self._lock:
            self._keys = {}
            self._last_fetch = 0.0


# Module-level singleton
jwks_client = JWKSClient()


def get_jwks_client() -> JWKSClient:
    return jwks_client
