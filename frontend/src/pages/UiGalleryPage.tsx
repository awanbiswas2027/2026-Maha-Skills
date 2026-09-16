import React, { useState } from 'react';
import {
  Badge,
  Alert,
  Skeleton,
  DelayedSkeleton,
  Input,
  Textarea,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Progress,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../components/ui';

import {
  StatusBadge,
  SeverityBadge,
  EmptyState,
  ErrorState,
  MetricStrip,
  DataFreshness,
  Breadcrumb,
  EntityHeader,
  FormField,
  Combobox,
  ThemeToggle,
} from '../components/common';

import { useToast } from '../components/ui/use-toast';
import { ChevronDown, Download, Filter, Plus, RefreshCw, Settings } from 'lucide-react';
import type { WorkflowStatus } from '../types/ui';

export const UiGalleryPage: React.FC = () => {
  const { toast } = useToast();
  const [comboboxVal, setComboboxVal] = useState('pune');
  const [selectVal, setSelectVal] = useState('marathi');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [progressVal] = useState(65);

  const statuses: WorkflowStatus[] = [
    'DRAFT',
    'SSC_REVIEW',
    'DSEEI_APPROVAL',
    'UNDER_REVIEW',
    'VALIDATING',
    'CHANGES_REQUESTED',
    'APPROVED',
    'PUBLISHED',
    'COMPLETED',
    'ACTIVE',
    'REJECTED',
    'FAILED',
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 sm:p-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">MahaSkills UI Component Gallery</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Dev-only catalog for testing primitives, composite states, and dual-theme accessibility (§25).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            onClick={() =>
              toast({
                title: 'Action Triggered',
                description: 'Toast rendered per specifications (6s timeout, z-toast).',
                variant: 'success',
              })
            }
          >
            Trigger Toast
          </Button>
        </div>
      </div>

      {/* 1. Badges & Severity */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">1. Badges & Status Indicators</h2>
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Standard Badges</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral">NSQF Level 4</Badge>
            <Badge variant="outline">Sector: Automotive</Badge>
            <Badge variant="info">New Curriculum</Badge>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Gap Severity Badges (§7.3, GAP-01)</h3>
          <div className="flex flex-wrap items-center gap-3">
            <SeverityBadge severity="HIGH" score={88} />
            <SeverityBadge severity="MEDIUM" score={52} />
            <SeverityBadge severity="LOW" score={18} />
            <SeverityBadge severity="HIGH" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">Workflow Status Badges (§25.2, 12 States)</h3>
          <div className="flex flex-wrap items-center gap-2">
            {statuses.map((s) => (
              <StatusBadge key={s} status={s} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Metric / KPI Strip */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">2. MetricStrip (KPI)</h2>
        <MetricStrip
          metrics={[
            {
              label: 'Total Vocational Enrollment',
              value: '1,42,850',
              delta: 12.4,
              comparisonLabel: 'vs last FY',
              goodDirection: 'up',
            },
            {
              label: 'Avg Gap Score',
              value: '64.2',
              delta: -3.8,
              comparisonLabel: 'quarterly trend',
              goodDirection: 'down',
            },
            {
              label: 'Curriculum Alignments',
              value: '28',
              unit: 'trades',
              delta: 4,
              goodDirection: 'up',
            },
            {
              label: 'Placement Rate',
              value: '78.5%',
              delta: 0,
              comparisonLabel: 'target 80%',
            },
          ]}
        />
      </section>

      {/* 3. Entity Header & Breadcrumbs */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">3. Entity Header & Breadcrumb (§18)</h2>
        <EntityHeader
          breadcrumb={
            <Breadcrumb
              items={[
                { label: 'Districts', href: '/districts' },
                { label: 'Pune', href: '/districts/pune' },
                { label: 'Aundh ITI' },
              ]}
            />
          }
          title="Industrial Training Institute, Aundh"
          status={<StatusBadge status="ACTIVE" />}
          codes={[
            { label: 'DGET Code', value: 'PR27000001' },
            { label: 'District', value: 'Pune (25)' },
          ]}
          scope="Western Maharashtra"
          updatedAt="17 Sep 2026, 02:30"
          primaryAction={
            <Button className="w-full sm:w-auto gap-2">
              <Plus className="h-4 w-4" />
              <span>Propose Alignment</span>
            </Button>
          }
          secondaryActions={[
            <Button key="export" variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export Summary</span>
            </Button>,
          ]}
          overflowActions={[
            <button key="1" className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted">View Audit Trail</button>,
            <button key="2" className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted">Configure Scope</button>,
          ]}
        />
      </section>

      {/* 4. Alerts & System Feedback */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">4. Alerts (§25.2)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Alert variant="info" title="Taxonomy Synchronized">
            NSQF alignment matrix updated from DSEEI master database.
          </Alert>
          <Alert variant="success" title="Verification Passed">
            All candidate verification checksums passed DPDP Act pseudonymization.
          </Alert>
          <Alert variant="warning" title="Stale Placement Data">
            14 ITIs have pending placement upload submissions past the monthly deadline.
          </Alert>
          <Alert variant="danger" title="Critical Gap Identified" blocking>
            CNC Milling operator deficit exceeds 450 seats in Aurangabad cluster.
          </Alert>
        </div>
      </section>

      {/* 5. Form Controls */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">5. Form Controls & Combobox</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField id="demo-input" label="Candidate ID / Identifier" helper="Pseudonymized DPDP token" required>
            {(aria) => <Input placeholder="e.g. MH-2026-9921" {...aria} />}
          </FormField>

          <FormField id="demo-select" label="Target Language" required>
            {() => (
              <Select value={selectVal} onValueChange={setSelectVal}>
                <SelectTrigger id="demo-select">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="marathi">मराठी (Marathi)</SelectItem>
                  <SelectItem value="hindi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                </SelectContent>
              </Select>
            )}
          </FormField>

          <FormField id="demo-combobox" label="District Selection (Bilingual)">
            {() => (
              <Combobox
                value={comboboxVal}
                onChange={setComboboxVal}
                placeholder="Search district..."
                options={[
                  { value: 'pune', labelEn: 'Pune', labelMr: 'पुणे', code: '25' },
                  { value: 'mumbai', labelEn: 'Mumbai Suburban', labelMr: 'मुंबई उपनगर', code: '23' },
                  { value: 'nagpur', labelEn: 'Nagpur', labelMr: 'नागपूर', code: '09' },
                  { value: 'aurangabad', labelEn: 'Chhatrapati Sambhajinagar', labelMr: 'छत्रपती संभाजीनगर', code: '19' },
                  { value: 'nashik', labelEn: 'Nashik', labelMr: 'नाशिक', code: '20' },
                ]}
              />
            )}
          </FormField>

          <div className="sm:col-span-2">
            <FormField id="demo-textarea" label="Justification Notes" helper="Max 250 characters">
              {(aria) => <Textarea placeholder="Explain curriculum rationale..." maxLength={250} {...aria} />}
            </FormField>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" defaultChecked />
              <Label htmlFor="terms">Acknowledge DPDP 2023 Consent Scope</Label>
            </div>

            <RadioGroup defaultValue="active">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="r1" />
                <Label htmlFor="r1">Immediate Ingest</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="batch" id="r2" />
                <Label htmlFor="r2">Scheduled Nightly Batch</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* 6. Empty & Error States */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">6. Empty & Error States (§20)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EmptyState
            type="no-results"
            title="No Matching ITI Trades"
            description="Try loosening your search filters or selecting an adjacent district."
            action={<Button variant="outline" size="sm">Reset Search</Button>}
          />
          <ErrorState
            error={{
              code: 'RATE_LIMITED',
              traceId: 'tr-test-84920412',
            }}
            onRetry={() => alert('Retry requested')}
          />
        </div>
      </section>

      {/* 7. Dialog, Sheet & Overlays */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">7. Overlays & Action Primitives</h2>
        <div className="flex flex-wrap items-center gap-4">
          {/* Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open Modal Dialog</Button>
            </DialogTrigger>
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle>Confirm Curriculum Submission</DialogTitle>
                <DialogDescription>
                  This will dispatch the proposed trade alignment to SSC and DSEEI review committees.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 text-sm text-muted-foreground">
                Review period SLA is 14 business days. You can track progress in the workflow panel.
              </div>
              <DialogFooter>
                <Button variant="default">Submit Alignment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open Filter Drawer (Sheet)</Button>
            </SheetTrigger>
            <SheetContent size="md">
              <SheetHeader>
                <SheetTitle>Filter Labor Demand Data</SheetTitle>
                <SheetDescription>
                  Apply multi-criteria filters across 36 districts and 417+ ITIs.
                </SheetDescription>
              </SheetHeader>
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                  <Label>NSQF Tier</Label>
                  <Select defaultValue="4">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Level 3 (Semi-skilled)</SelectItem>
                      <SelectItem value="4">Level 4 (Skilled)</SelectItem>
                      <SelectItem value="5">Level 5 (Supervisor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* IconButton */}
          <IconButton label="Refresh Statistics" variant="outline">
            <RefreshCw className="h-4 w-4" />
          </IconButton>

          <IconButton label="Filter Options" variant="outline">
            <Filter className="h-4 w-4" />
          </IconButton>

          <IconButton label="Settings" variant="ghost">
            <Settings className="h-4 w-4" />
          </IconButton>
        </div>
      </section>

      {/* 8. Progress, Tabs & Collapsible */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">8. Navigation & Disclosure</h2>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Trade Overview</TabsTrigger>
            <TabsTrigger value="gap">Gap Breakdown</TabsTrigger>
            <TabsTrigger value="institutes">Affiliated ITIs (18)</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="p-4 border rounded-md mt-2">
            <h4 className="font-semibold mb-2">Trade Overview Details</h4>
            <p className="text-sm text-muted-foreground">Active syllabus v2.4 aligned with NSQF Level 4.</p>
          </TabsContent>
          <TabsContent value="gap" className="p-4 border rounded-md mt-2">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Alignment Fulfillment</span>
                <span className="font-semibold">{progressVal}%</span>
              </div>
              <Progress value={progressVal} />
            </div>
          </TabsContent>
          <TabsContent value="institutes" className="p-4 border rounded-md mt-2">
            <p className="text-sm text-muted-foreground">List of 18 institutions offering this course.</p>
          </TabsContent>
        </Tabs>

        <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="border rounded-md p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Technical Methodology & Weighting Notes</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${collapsibleOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-3 text-sm text-muted-foreground leading-relaxed border-t pt-2">
            Gap scoring uses four weighted components: Live Demand Deficit (40%), Placement Velocity (25%),
            Equipment Modernization Index (20%), and Industry Advisory Feedback (15%).
          </CollapsibleContent>
        </Collapsible>
      </section>

      {/* 9. Data Freshness */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">9. Data Freshness (§25.2)</h2>
        <div className="space-y-3">
          <DataFreshness
            sources={['NCS API', 'Naukri Scraper', 'DSEEI Returns']}
            asOf="17 Sep 2026, 02:00 IST"
            runId="RUN-20260917-0200"
            completeness="36 of 36 districts reporting"
            staleDays={2}
          />
          <DataFreshness
            sources={['ITI Placement Monthly Records']}
            asOf="01 Aug 2026"
            runId="RUN-20260801-0000"
            completeness="18 of 36 districts"
            staleDays={14}
          />
        </div>
      </section>

      {/* 10. Table & Card Primitives */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">10. Table (A-22) & Card (A-05)</h2>
        <Card>
          <CardHeader>
            <CardTitle as="h2">Affiliated Trade Offerings</CardTitle>
            <CardDescription>Verified training seats across public ITIs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table wrapperAriaLabel="Affiliated trade offerings table">
              <TableHeader>
                <TableRow>
                  <TableHead>Trade Name</TableHead>
                  <TableHead>NSQF</TableHead>
                  <TableHead>Total Seats</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Electrician</TableCell>
                  <TableCell>Level 4</TableCell>
                  <TableCell>120</TableCell>
                  <TableCell><StatusBadge status="ACTIVE" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fitter</TableCell>
                  <TableCell>Level 4</TableCell>
                  <TableCell>80</TableCell>
                  <TableCell><StatusBadge status="ACTIVE" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Solar Technician (Electrical)</TableCell>
                  <TableCell>Level 4</TableCell>
                  <TableCell>40</TableCell>
                  <TableCell><StatusBadge status="APPROVED" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* 11. Skeletons */}
      <section className="space-y-4 pb-12">
        <h2 className="text-xl font-semibold border-b border-border pb-2">11. Skeletons & Delayed Skeletons</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton shape="kpi" />
          <Skeleton shape="kpi" />
          <Skeleton shape="kpi" />
          <Skeleton shape="kpi" />
        </div>
        <div className="space-y-2">
          <Skeleton shape="line" />
          <Skeleton shape="row" />
          <DelayedSkeleton shape="line" delayMs={100} />
        </div>
      </section>
    </div>
  );
};
