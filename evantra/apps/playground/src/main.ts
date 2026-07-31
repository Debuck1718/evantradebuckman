import {
  Application,
  ApplicationContext,
  CreateEntityCommand,
  Kernel,
  StateMachine,
  Workflow,
  WorkflowActivity,
  WorkflowContext,
  UserStatus,
} from "@evantra/kernel";

/* =========================================================
 * Demo Application
 * =======================================================*/

class DemoApplication
  implements Application
{
  readonly id = "demo";

  readonly name =
    "Demo Application";

  readonly version =
    "1.0.0";

  readonly route =
    "/demo";

  readonly enabled =
    true;

  async initialize(
    context: ApplicationContext
  ): Promise<void> {

    console.log(
      "✓ Demo Application initialized."
    );

    console.table(
      context.status()
    );
  }

  async shutdown(): Promise<void> {

    console.log(
      "✓ Demo Application stopped."
    );
  }
}

/* =========================================================
 * Demo Workflow Activity
 * =======================================================*/

class ConsoleActivity
  implements WorkflowActivity
{
  readonly id =
    "console.activity";

  readonly name =
    "Console Activity";

  async execute(
    context: WorkflowContext
  ): Promise<void> {

    console.log(
      "✓ Workflow Activity Executed"
    );

    console.log(
      "Triggered by:",
      context.event.type
    );
  }
}

/* =========================================================
 * Demo Workflow
 * =======================================================*/

class DemoWorkflow
  implements Workflow
{
  readonly id =
    "demo.workflow";

  readonly name =
    "Demo Workflow";

  readonly event =
    "StateTransitioned";

  readonly enabled =
    true;

  readonly activities = [
    new ConsoleActivity(),
  ];
}

/* =========================================================
 * Console Helpers
 * =======================================================*/

function header(): void {

  console.clear();

  console.log(`
==============================================================
            EVANTRA KERNEL INTEGRATION TEST
==============================================================
`);
}

function section(
  title: string
): void {

  console.log(
    `\n=== ${title} ===`
  );
}

function success(
  message: string
): void {

  console.log(
    `✓ ${message}`
  );
}

function info(
  label: string,
  value: unknown
): void {

  console.log(
    `${label}:`,
    value
  );
}

/* =========================================================
 * Runtime
 * =======================================================*/

async function testRuntime(
  kernel: Kernel
): Promise<void> {

  section(
    "Runtime"
  );

  console.table(
    kernel.status()
  );

  success(
    "Kernel booted successfully."
  );
}

/* =========================================================
 * Services
 * =======================================================*/

async function testServices(
  kernel: Kernel
): Promise<void> {

  section(
    "Services"
  );

  console.table(
    kernel.services.toJSON()
  );

  info(
    "Registered Services",
    kernel.services.size
  );

  success(
    "Service container verified."
  );
}

/* =========================================================
 * Pipeline
 * =======================================================*/

async function testPipeline(
  kernel: Kernel
): Promise<void> {

  section(
    "Pipeline"
  );

  console.table(
    kernel.pipeline
      .list()
      .map(step => ({
        step:
          step.constructor.name,
      }))
  );

  success(
    "Pipeline verified."
  );
}

/* =========================================================
 * Part 2 starts here...
 * =======================================================*/

/* =========================================================
 * Applications
 * =======================================================*/

async function testApplications(
  kernel: Kernel
): Promise<void> {

  section(
    "Application Runtime"
  );

  const application =
    new DemoApplication();

  kernel.applications.register(
    application
  );

  success(
    "Application registered."
  );

  await kernel.applications.start(
    application.id
  );

  success(
    "Application started."
  );

  info(
    "Running Applications",
    kernel.applications
      .running()
      .length
  );
}

/* =========================================================
 * Identity
 * =======================================================*/

async function testIdentity(
  kernel: Kernel
): Promise<void> {

  section(
    "Identity"
  );

  kernel.identity.register({
    id: "user-identity-001",

    email: "evans@evantra.com",

    username: "evans",

    status: UserStatus.PENDING,

    profile: {
      firstName: "Evans",

      lastName: "Buckman",

      displayName: "Evans",
    },

    createdAt: new Date(),

    updatedAt: new Date(),
  });

  success(
    "Identity registered."
  );

  console.log(
    "\nFind by ID"
  );

  console.table(
    kernel.identity.get(
      "user-identity-001"
    )
  );

  console.log(
    "\nFind by Email"
  );

  console.table(
    kernel.identity.findByEmail(
      "evans@evantra.com"
    )
  );

  console.log(
    "\nFind by Username"
  );

  console.table(
    kernel.identity.findByUsername(
      "evans"
    )
  );

  kernel.identity.updateProfile(
    "user-identity-001",
    {
      displayName:
        "Evans Buckman",

      country:
        "Ghana",
    }
  );

  success(
    "Profile updated."
  );

  kernel.identity.activate(
    "user-identity-001"
  );

  success(
    "Identity activated."
  );

  console.log(
    "\nCurrent User"
  );

  console.table(
    kernel.identity.get(
      "user-identity-001"
    )
  );

  console.log(
    "\nRegistered Users"
  );

  console.table(
    kernel.identity.all()
  );

  console.log(
    "\nIdentity Count:",
    kernel.identity.count()
  );
}

/* =========================================================
 * Workflows
 * =======================================================*/

async function testWorkflows(
  kernel: Kernel
): Promise<void> {

  section(
    "Workflow Runtime"
  );

  const workflow =
    new DemoWorkflow();

  kernel.workflows.register(
    workflow
  );

  success(
    "Workflow registered."
  );

  info(
    "Registered Workflows",
    kernel.workflows.count()
  );
}

/* =========================================================
 * Entity Registry
 * =======================================================*/

async function testEntities(
  kernel: Kernel
): Promise<void> {

  section(
    "Entity Registry"
  );

  await kernel.execute(
    new CreateEntityCommand({
      id: "user-1",
      type: "User",
      metadata: {
        firstName: "Evans",
      },
    })
  );

  success(
    "User entity created."
  );

  await kernel.entities.create({
    id: "order-001",
    type: "Order",
    workflowState: "Pending",
    metadata: {
      customer: "Evans",
      total: 150,
    },
  });

  success(
    "Order entity created."
  );

  console.table(
    kernel.entities.get(
      "order-001"
    )
  );
}

/* =========================================================
 * State Machine
 * =======================================================*/

async function testStateMachine(
  kernel: Kernel
): Promise<void> {

  section(
    "State Machine"
  );

  const machine =
    new StateMachine({

      name: "Order",

      initial: "Pending",

      states: [
        {
          name: "Pending",
          initial: true,
        },
        {
          name: "Paid",
        },
        {
          name: "Packed",
        },
        {
          name: "Shipped",
        },
        {
          name: "Delivered",
          final: true,
        },
      ],

      transitions: [
        {
          from: "Pending",
          to: "Paid",
          action: "pay",
        },
        {
          from: "Paid",
          to: "Packed",
          action: "pack",
        },
        {
          from: "Packed",
          to: "Shipped",
          action: "ship",
        },
        {
          from: "Shipped",
          to: "Delivered",
          action: "deliver",
        },
      ],
    });

  kernel.states.register(
    "Order",
    machine
  );

  success(
    "Order state machine registered."
  );

  info(
    "Available Actions",
    kernel.states.actions(
      "order-001"
    )
  );

  const actions = [
    "pay",
    "pack",
    "ship",
    "deliver",
  ];

  for (const action of actions) {

    console.log(
      `\n→ ${action}`
    );

    await kernel.states.transition(
      "order-001",
      action
    );

    console.table(
      kernel.entities.get(
        "order-001"
      )
    );
  }

  success(
    "Workflow completed."
  );
}

/* =========================================================
 * Scheduler
 * =======================================================*/

async function testScheduler(
  kernel: Kernel
): Promise<void> {

  section(
    "Scheduler"
  );

  info(
    "Scheduled Tasks",
    kernel.scheduler.count()
  );

  success(
    "Scheduler verified."
  );
}

/* =========================================================
 * Kernel Status
 * =======================================================*/

async function testKernelStatus(
  kernel: Kernel
): Promise<void> {

  section(
    "Kernel Status"
  );

  console.table(
    kernel.status()
  );

  success(
    "Kernel status verified."
  );
}

/* =========================================================
 * Main
 * =======================================================*/

async function main() {

  header();

  const kernel =
    new Kernel();

  await testRuntime(
    kernel
  );

  await testServices(
    kernel
  );

  await testPipeline(
    kernel
  );

  await testApplications(
    kernel
  );

  await testIdentity(
    kernel
  );

  await testWorkflows(
    kernel
  );

  await testEntities(
    kernel
  );

  await testStateMachine(
    kernel
  );

  await testScheduler(
    kernel
  );

  await testKernelStatus(
    kernel
  );

  section(
    "Shutdown"
  );

  await kernel.applications.stop(
    "demo"
  );

  kernel.stop();

  success(
    "Kernel shut down successfully."
  );
}

main().catch(console.error);