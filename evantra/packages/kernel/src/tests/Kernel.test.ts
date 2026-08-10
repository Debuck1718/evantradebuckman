import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import { Kernel } from "../core/Kernel";

describe("Evantra Kernel", () => {
  let kernel: Kernel;

  afterEach(() => {
    if (kernel) {
      kernel.stop();
    }
  });

  // ======================================================
  // Boot
  // ======================================================

  it("boots successfully", () => {
    kernel = new Kernel();

    expect(kernel.status().running).toBe(true);
  });

  // ======================================================
  // Version
  // ======================================================

  it("exposes the current kernel version", () => {
    kernel = new Kernel();

    expect(kernel.status().version).toBe("0.1.0");
  });

  // ======================================================
  // Core Services
  // ======================================================

  it("registers the expected core services", () => {
    kernel = new Kernel();

    const services = kernel.services.list();

    expect(services).toContain("EventBus");
    expect(services).toContain("EntityRegistry");
    expect(services).toContain("CommandBus");
    expect(services).toContain("Scheduler");
    expect(services).toContain("StateEngine");
    expect(services).toContain("TransitionHistory");
    expect(services).toContain("ApplicationContext");
    expect(services).toContain("ApplicationRegistry");
    expect(services).toContain("ApplicationManager");
    expect(services).toContain("OrganizationRegistry");
    expect(services).toContain("OrganizationManager");
    expect(services).toContain("BurdenEngine");
    expect(services).toContain("PromiseGraph");
    expect(services).toContain("LifeWorkOrchestrator");
    expect(services).toContain("WorkflowRegistry");
    expect(services).toContain("WorkflowEngine");
  });

  // ======================================================
  // Service Count
  // ======================================================

  it("registers the expected number of services", () => {
    kernel = new Kernel();

    expect(kernel.status().services).toBe(16);
  });

  // ======================================================
  // Initial State
  // ======================================================

  it("starts with empty kernel registries", () => {
    kernel = new Kernel();

    const status = kernel.status();

    expect(status.entities).toBe(0);
    expect(status.events).toBe(0);
    expect(status.scheduled).toBe(0);
    expect(status.stateMachines).toBe(0);
    expect(status.applications).toBe(0);
    expect(status.organizations).toBe(0);
    expect(status.workflows).toBe(0);
    expect(status.promises).toBe(0);
  });

  // ======================================================
  // Runtime Stop
  // ======================================================

  it("stops the runtime correctly", () => {
    kernel = new Kernel();

    expect(kernel.status().running).toBe(true);

    kernel.stop();

    expect(kernel.status().running).toBe(false);
  });

  // ======================================================
  // Service Container Access
  // ======================================================

  it("exposes the core subsystems through the kernel", () => {
    kernel = new Kernel();

    expect(kernel.entities).toBeDefined();
    expect(kernel.events).toBeDefined();
    expect(kernel.scheduler).toBeDefined();
    expect(kernel.states).toBeDefined();
    expect(kernel.history).toBeDefined();
    expect(kernel.applications).toBeDefined();
    expect(kernel.organizations).toBeDefined();
    expect(kernel.burden).toBeDefined();
    expect(kernel.promises).toBeDefined();
    expect(kernel.lifeWork).toBeDefined();
    expect(kernel.workflows).toBeDefined();
  });
});