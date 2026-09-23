import { Problem } from '../types/lld';

export const PROBLEMS: Problem[] = [
  {
    id: 'parking-lot-system',
    title: 'Design a Multi-Floor Parking Lot System',
    category: 'Object-Oriented System Design',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    brief:
      'Design a low-level object-oriented system for an automated multi-floor parking lot that can park various vehicle types, assign spots based on proximity, handle ticketing and fee calculation, and coordinate entry/exit gates safely.',
    requirements: {
      functional: [
        'The parking lot has multiple floors, each with dedicated spots of various types: Motorcycle, Compact, Large (Buses/Trucks), and Electric.',
        'When a vehicle arrives at an entry gate, issue an automated Ticket with timestamp, vehicle license, and assigned Spot ID.',
        'Spot allocation strategy should be swappable (e.g., Nearest to Entrance, Lowest Floor First, Random Balanced).',
        'When a vehicle exits, compute the fee using a pluggable pricing model (Hourly, Flat-Rate, Peak-Hour Surcharge, or EV charging addition).',
        'Support real-time display boards showing available spots per floor and type.',
      ],
      nonFunctional: [
        'Thread safety: Multiple entry gates must not assign the exact same parking spot simultaneously (race condition prevention).',
        'Extensibility (Open-Closed Principle): Easy to introduce a new VehicleType or new PricingStrategy without altering core parking lot classes.',
        'High cohesion and loose coupling: Decouple ticket issuance, spot search, and payment calculation.',
      ],
      constraints: [
        'Motorcycles can park in Motorcycle, Compact, or Large spots.',
        'Cars can park in Compact or Large spots.',
        'Large vehicles (Trucks/Buses) can only park in Large spots.',
        'Electric vehicles require an Electric spot with a charger plug.',
      ],
    },
    keyEntities: [
      'ParkingLot',
      'ParkingFloor',
      'ParkingSpot',
      'Vehicle',
      'Ticket',
      'ParkingStrategy',
      'PricingStrategy',
      'Gate',
      'Payment',
    ],
    recommendedPatterns: [
      'Strategy Pattern (for Spot Allocation & Fee Calculation)',
      'Factory Pattern (for Vehicle & Spot creation)',
      'Singleton Pattern (for ParkingLot orchestrator or configuration)',
      'Observer Pattern (for DisplayBoard updates on spot status change)',
    ],
    evaluationChecklist: [
      {
        id: 'srp-lot',
        name: 'Single Responsibility in ParkingLot',
        description: 'ParkingLot coordinates floors and gates; it does not calculate fees or run low-level spot search loops.',
        importance: 'CRITICAL',
      },
      {
        id: 'strategy-pricing',
        name: 'Strategy Pattern for Pricing & Spot Assignment',
        description: 'Pricing and spot allocation implemented via interfaces allowing dynamic swapping.',
        importance: 'IMPORTANT',
      },
      {
        id: 'thread-safety',
        name: 'Thread-Safe Spot Allocation',
        description: 'Synchronized spot booking to prevent double-allocation when multiple entry gates operate concurrently.',
        importance: 'CRITICAL',
      },
      {
        id: 'abstraction-vehicle',
        name: 'Vehicle & Spot Abstraction',
        description: 'Clean inheritance or composition representing vehicle sizes and spot compatibility.',
        importance: 'IMPORTANT',
      },
    ],
    starterTemplates: [
      {
        label: 'Clean Starter (Interfaces & Skeletons)',
        description: 'Minimal boilerplate with essential interfaces and class stubs.',
        content: {
          classDiagramUml: `classDiagram
    class ParkingLot {
        -String id
        -List~ParkingFloor~ floors
        -SpotAssignmentStrategy strategy
        +assignSpot(Vehicle vehicle)
        +releaseSpot(Ticket ticket)
    }
    class ParkingSpot {
        <<abstract>>
        -String spotId
        -SpotType type
        -boolean isOccupied
        +assignVehicle(Vehicle vehicle)
        +vacate()
    }
    class Vehicle {
        <<abstract>>
        -String licensePlate
        -VehicleType type
    }
    class Ticket {
        -String ticketId
        -Date entryTime
        -ParkingSpot assignedSpot
        -Vehicle vehicle
    }
    class SpotAssignmentStrategy {
        <<interface>>
        +findSpot(List~ParkingFloor~ floors, Vehicle vehicle) ParkingSpot
    }
    ParkingLot --> ParkingFloor
    ParkingLot --> SpotAssignmentStrategy
    ParkingFloor --> ParkingSpot
    ParkingSpot --> Vehicle
    Ticket --> ParkingSpot`,
          entities: [
            {
              id: 'e1',
              name: 'ParkingLot',
              type: 'class',
              responsibilities: 'Top-level facade coordinating floors, entrance gates, and spot strategies.',
              fields: ['- floors: List<ParkingFloor>', '- assignmentStrategy: SpotAssignmentStrategy', '- activeTickets: Map<string, Ticket>'],
              methods: ['+ parkVehicle(Vehicle v): Ticket', '+ exitVehicle(Ticket t, PaymentMethod p): Receipt'],
              relationships: [{ source: 'ParkingLot', target: 'ParkingFloor', type: 'composition' }, { source: 'ParkingLot', target: 'SpotAssignmentStrategy', type: 'association' }],
            },
            {
              id: 'e2',
              name: 'ParkingSpot',
              type: 'abstract_class',
              responsibilities: 'Represents a physical spot; manages occupancy state and vehicle assignment.',
              fields: ['# id: string', '# isOccupied: boolean', '# vehicle: Vehicle'],
              methods: ['+ isAvailable(): boolean', '+ assignVehicle(Vehicle v): void', '+ removeVehicle(): void'],
              relationships: [{ source: 'ParkingSpot', target: 'Vehicle', type: 'association' }],
            },
            {
              id: 'e3',
              name: 'SpotAssignmentStrategy',
              type: 'interface',
              responsibilities: 'Strategy abstraction for selecting the best available spot for a vehicle.',
              fields: [],
              methods: ['+ findSpot(floors: List<ParkingFloor>, vehicle: Vehicle): ParkingSpot'],
              relationships: [],
            },
            {
              id: 'e4',
              name: 'Ticket',
              type: 'class',
              responsibilities: 'Immutable receipt generated upon vehicle entry.',
              fields: ['- ticketId: string', '- entryTime: Date', '- spot: ParkingSpot', '- vehicle: Vehicle'],
              methods: ['+ getDurationMinutes(): number'],
              relationships: [{ source: 'Ticket', target: 'ParkingSpot', type: 'association' }],
            },
          ],
          sourceCode: `// Multi-floor Parking Lot Skeleton
export enum VehicleType { MOTORCYCLE, CAR, TRUCK, ELECTRIC }
export enum SpotType { COMPACT, LARGE, MOTORCYCLE, ELECTRIC }

export interface SpotAssignmentStrategy {
  findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null;
}

export interface PricingStrategy {
  calculateFee(durationMinutes: number, vehicleType: VehicleType): number;
}

export abstract class Vehicle {
  constructor(public readonly licensePlate: string, public readonly type: VehicleType) {}
}

export class Car extends Vehicle {
  constructor(licensePlate: string) {
    super(licensePlate, VehicleType.CAR);
  }
}

export class Ticket {
  public readonly id: string = Math.random().toString(36).substring(7);
  public readonly entryTime: Date = new Date();
  constructor(public readonly vehicle: Vehicle, public readonly spot: ParkingSpot) {}
}

export abstract class ParkingSpot {
  private occupied: boolean = false;
  private currentVehicle: Vehicle | null = null;

  constructor(public readonly id: string, public readonly type: SpotType) {}

  public synchronizedAssign(vehicle: Vehicle): boolean {
    if (this.occupied) return false;
    this.occupied = true;
    this.currentVehicle = vehicle;
    return true;
  }

  public vacate(): void {
    this.occupied = false;
    this.currentVehicle = null;
  }

  public isFree(): boolean {
    return !this.occupied;
  }
}

export class ParkingFloor {
  constructor(public readonly floorNumber: number, public readonly spots: ParkingSpot[]) {}
}

export class ParkingLot {
  private floors: ParkingFloor[] = [];
  private activeTickets: Map<string, Ticket> = new Map();

  constructor(
    private spotStrategy: SpotAssignmentStrategy,
    private pricingStrategy: PricingStrategy
  ) {}

  public park(vehicle: Vehicle): Ticket {
    const spot = this.spotStrategy.findSpot(this.floors, vehicle);
    if (!spot) throw new Error("Parking Lot Full");
    
    spot.synchronizedAssign(vehicle);
    const ticket = new Ticket(vehicle, spot);
    this.activeTickets.set(ticket.id, ticket);
    return ticket;
  }

  public exit(ticketId: string): number {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) throw new Error("Invalid ticket");
    
    const duration = (Date.now() - ticket.entryTime.getTime()) / (1000 * 60);
    const fee = this.pricingStrategy.calculateFee(duration, ticket.vehicle.type);
    ticket.spot.vacate();
    this.activeTickets.delete(ticketId);
    return fee;
  }
}`,
          designDecisions: {
            patternsUsed: 'Strategy Pattern for Spot Assignment and Pricing Strategy; Factory for spot and vehicle instantiation; Facade for ParkingLot coordinator.',
            concurrencyStrategy: 'Method-level atomic/synchronized lock on ParkingSpot.synchronizedAssign() to ensure two entry gates cannot claim the same spot simultaneously.',
            extensibilityNotes: 'New vehicle types or new spot algorithms (e.g. VIP Nearest, EV Quick-charge priority) can be added by implementing SpotAssignmentStrategy without touching ParkingLot.',
            tradeoffsConsidered: 'Trade-off: In-memory map for activeTickets instead of persistent database for low latency. Fine-grained locking per spot rather than coarse lock on entire ParkingLot to maximize entrance throughput.',
          },
        },
      },
      {
        label: 'Deliberate Flawed Attempt (God Class / Anti-Patterns)',
        description: 'A monolithic design with God Class and zero interfaces. Great for testing how the evaluation engine diagnoses flaws.',
        content: {
          classDiagramUml: `classDiagram
    class ParkingLotGodClass {
        +int spots
        +calculateFee()
        +findSpot()
        +processCreditCard()
        +printReceipt()
        +repairSpot()
        +cleanFloor()
    }`,
          entities: [
            {
              id: 'god1',
              name: 'ParkingLotGodClass',
              type: 'class',
              responsibilities: 'Handles everything: spots, vehicles, tickets, database connection, credit card payments, floor cleaning, and fee calculations.',
              fields: ['- allSpots: any[]', '- payments: any[]', '- ticketDb: any', '- sensorData: any'],
              methods: [
                '+ park(v: any): any',
                '+ exit(t: any): any',
                '+ computeBill(hours: number): number',
                '+ chargeStripe(cc: string): boolean',
                '+ cleanFloor(f: number): void',
                '+ sendSmsAlert(msg: string): void',
                '+ printPaperTicket(): void',
              ],
              relationships: [],
            },
          ],
          sourceCode: `// Monolithic God Class Anti-Pattern
export class ParkingLotGodClass {
  public spots: any[] = [];
  public tickets: any[] = [];

  public park(carType: string, license: string) {
    // Hardcoded logic mixing spot search and pricing
    for (let i = 0; i < this.spots.length; i++) {
      if (!this.spots[i].taken) {
        this.spots[i].taken = true;
        return { id: "T1", time: Date.now() };
      }
    }
    return null;
  }

  public calculateFee(hours: number, carType: string) {
    if (carType === 'car') return hours * 10;
    if (carType === 'bike') return hours * 5;
    return hours * 20;
  }

  public chargeCard(cardNumber: string, amount: number) {
    // Direct payment coupling
    return true;
  }
}`,
          designDecisions: {
            patternsUsed: 'None. Everything put into one single class for simplicity.',
            concurrencyStrategy: 'None. Assuming single-threaded environment.',
            extensibilityNotes: 'If a new vehicle comes, we will modify the calculateFee if-else statements.',
            tradeoffsConsidered: 'Wanted to write less files.',
          },
        },
      },
    ],
    referenceSolution: {
      overview: 'Clean architecture separating domain entities, allocation strategies, ticket state, and payment services.',
      entities: [
        {
          id: 'ref1',
          name: 'ParkingLot',
          type: 'class',
          responsibilities: 'Singleton orchestration of parking floors, gates, and configuration.',
          fields: ['- instance: ParkingLot', '- floors: List<ParkingFloor>', '- strategy: SpotAssignmentStrategy'],
          methods: ['+ getInstance(): ParkingLot', '+ processEntry(v: Vehicle): Ticket', '+ processExit(t: Ticket): Receipt'],
          relationships: [{ source: 'ParkingLot', target: 'ParkingFloor', type: 'composition' }],
        },
        {
          id: 'ref2',
          name: 'SpotAssignmentStrategy',
          type: 'interface',
          responsibilities: 'Pluggable search algorithm for spot allocation.',
          fields: [],
          methods: ['+ findSpot(floors: List<ParkingFloor>, v: Vehicle): ParkingSpot'],
          relationships: [],
        },
      ],
      sourceCode: `// Reference Architecture Highlights
// Demonstrates Strategy, Observer for display boards, and atomic CAS for spot assignment.`,
      designDecisions: {
        patternsUsed: 'Strategy (SpotAssignmentStrategy, FeeCalculationStrategy), Observer (DisplayBoard updates), Factory (VehicleFactory).',
        concurrencyStrategy: 'AtomicReference or ReentrantLock on individual ParkingSpot state transitions.',
        extensibilityNotes: 'OCP achieved through polymorphic strategy injection.',
        tradeoffsConsidered: 'Trade-off: Per-spot lock prevents global bottle-necking at busy peak hours.',
      },
      discussionNotes: 'Senior interviewers look for separation of fee calculation from spot lifecycle, and explicit race condition handling on the last available parking spot.',
    },
  },
  {
    id: 'elevator-control-system',
    title: 'Design an Elevator Control System',
    category: 'Stateful System & Hardware Abstraction',
    difficulty: 'HARD',
    estimatedMinutes: 35,
    brief:
      'Design an elevator dispatch and control system for a 40-story commercial skyscraper with multiple elevator cars, handling internal floor selections, external hall calls, directional movement, and scheduling algorithms.',
    requirements: {
      functional: [
        'Multiple elevator cars operate across 40 floors.',
        'Passengers can press Up/Down buttons in the hallway (Hallway Call).',
        'Passengers inside an elevator car can press floor buttons (Internal Request).',
        'Elevator dispatch algorithm determines which elevator serves a hallway request (e.g. Nearest Car, SCAN/LOOK disk scheduling, or Idle Car).',
        'Elevator car transitions through distinct states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPENING, MAINTENANCE.',
      ],
      nonFunctional: [
        'Safety constraints: An elevator must never move with doors open.',
        'Extensibility: Dispatch algorithm must be swappable without modifying ElevatorCar class.',
        'High responsiveness: Minimize average passenger wait time and prevent starvation.',
      ],
      constraints: [
        'Each elevator has a maximum weight limit (load sensor).',
        'Emergency stop overrides normal dispatch operations.',
      ],
    },
    keyEntities: [
      'ElevatorController',
      'ElevatorCar',
      'ElevatorState',
      'DispatchStrategy',
      'FloorRequest',
      'InternalPanel',
      'HallwayPanel',
      'Door',
    ],
    recommendedPatterns: [
      'State Pattern (for ElevatorCar states and legal transitions)',
      'Strategy Pattern (for Elevator Dispatching: LOOK / SCAN / Nearest)',
      'Command Pattern (for Floor requests and emergency actions)',
      'Observer Pattern (for floor sensors notifying controller)',
    ],
    evaluationChecklist: [
      {
        id: 'elev-state',
        name: 'State Pattern for Car Movement',
        description: 'Elevator state modeled with clean State pattern to enforce valid transitions (e.g. cannot open doors while moving).',
        importance: 'CRITICAL',
      },
      {
        id: 'elev-strategy',
        name: 'Dispatch Strategy Abstraction',
        description: 'Decoupled scheduling algorithm from the controller.',
        importance: 'IMPORTANT',
      },
      {
        id: 'elev-concurrency',
        name: 'Request Queue Thread Safety',
        description: 'Safe handling of concurrent button presses while elevator is in motion.',
        importance: 'CRITICAL',
      },
    ],
    starterTemplates: [
      {
        label: 'Guided Starter (State Pattern + Dispatcher)',
        description: 'Structured elevator system with State pattern interface and LookDispatchStrategy.',
        content: {
          classDiagramUml: `classDiagram
    class ElevatorController {
        -List~ElevatorCar~ elevators
        -DispatchStrategy dispatcher
        +requestElevator(int floor, Direction direction)
    }
    class ElevatorCar {
        -int id
        -int currentFloor
        -ElevatorState state
        -TreeSet~int~ upStops
        -TreeSet~int~ downStops
        +pressFloorButton(int floor)
        +step()
    }
    class ElevatorState {
        <<interface>>
        +moveUp(ElevatorCar car)
        +moveDown(ElevatorCar car)
        +openDoor(ElevatorCar car)
    }
    class DispatchStrategy {
        <<interface>>
        +selectBestCar(List~ElevatorCar~ cars, int floor, Direction dir) ElevatorCar
    }
    ElevatorController --> ElevatorCar
    ElevatorController --> DispatchStrategy
    ElevatorCar --> ElevatorState`,
          entities: [
            {
              id: 'el1',
              name: 'ElevatorController',
              type: 'class',
              responsibilities: 'Central dispatcher receiving hallway calls and delegating to optimal cars.',
              fields: ['- elevators: List<ElevatorCar>', '- dispatcher: DispatchStrategy'],
              methods: ['+ handleHallCall(floor: number, dir: Direction): void'],
              relationships: [{ source: 'ElevatorController', target: 'ElevatorCar', type: 'composition' }, { source: 'ElevatorController', target: 'DispatchStrategy', type: 'association' }],
            },
            {
              id: 'el2',
              name: 'ElevatorCar',
              type: 'class',
              responsibilities: 'Represents physical elevator cabin; tracks floor position, door, and destination stops.',
              fields: ['- id: number', '- currentFloor: number', '- state: ElevatorState', '- door: Door'],
              methods: ['+ addDestination(floor: number): void', '+ step(): void'],
              relationships: [{ source: 'ElevatorCar', target: 'ElevatorState', type: 'association' }],
            },
            {
              id: 'el3',
              name: 'ElevatorState',
              type: 'interface',
              responsibilities: 'Encapsulates behavior corresponding to elevator motion and door states.',
              fields: [],
              methods: ['+ onEnter(car: ElevatorCar): void', '+ onFloorReached(car: ElevatorCar): void'],
              relationships: [],
            },
          ],
          sourceCode: `export enum Direction { UP, DOWN, IDLE }

export interface ElevatorState {
  handleFloorReached(car: ElevatorCar, floor: number): void;
  openDoor(car: ElevatorCar): void;
}

export interface DispatchStrategy {
  selectElevator(cars: ElevatorCar[], floor: number, direction: Direction): ElevatorCar;
}

export class ElevatorCar {
  public currentFloor: number = 1;
  public direction: Direction = Direction.IDLE;
  private upQueue: Set<number> = new Set();
  private downQueue: Set<number> = new Set();

  constructor(public readonly id: number, private state: ElevatorState) {}

  public synchronizedAddStop(floor: number): void {
    if (floor > this.currentFloor) this.upQueue.add(floor);
    else this.downQueue.add(floor);
  }

  public setState(newState: ElevatorState) {
    this.state = newState;
  }
}`,
          designDecisions: {
            patternsUsed: 'State Pattern for Car Lifecycle (IdleState, MovingState, DoorOpenState); Strategy for Dispatch algorithm.',
            concurrencyStrategy: 'Thread-safe concurrent queues for destination stops with mutex locking on car state updates.',
            extensibilityNotes: 'Easily plug in zoning dispatch (e.g. Cars 1-4 for Floors 1-20) by swapping DispatchStrategy.',
            tradeoffsConsidered: 'Trade-off: LOOK algorithm over FCFS to prevent excessive mechanical wear and reduce passenger wait time.',
          },
        },
      },
    ],
    referenceSolution: {
      overview: 'State-driven elevator engine with dual-priority queues (Min-Heap / Max-Heap) for O(1) next stop discovery.',
      entities: [],
      sourceCode: `// Reference implementation with LOOK / SCAN algorithm`,
      designDecisions: {
        patternsUsed: 'State, Strategy, Command',
        concurrencyStrategy: 'ReentrantLock with Condition variables for floor arrival signaling.',
        extensibilityNotes: 'Pluggable scheduling algorithms.',
        tradeoffsConsidered: 'Heuristic LOOK vs complex Hungarian algorithm.',
      },
      discussionNotes: 'Discuss edge cases: elevator reverses direction only when current queue is completely drained.',
    },
  },
  {
    id: 'vending-machine-system',
    title: 'Design a State-Driven Vending Machine',
    category: 'State Machine & Inventory Management',
    difficulty: 'EASY',
    estimatedMinutes: 25,
    brief:
      'Design an object-oriented vending machine that supports coin/cash insertion, item selection, change dispensing, cancellation refund, and out-of-stock handling using strict state transitions.',
    requirements: {
      functional: [
        'Supports inserting coins (Nickel, Dime, Quarter) and currency notes.',
        'Displays list of available items with codes, prices, and stock quantity.',
        'Allows user to select an item code.',
        'Dispenses item if inserted balance >= price; returns remainder as change in optimal coin denominations.',
        'Allows user to cancel transaction anytime before dispensing and receive full refund.',
      ],
      nonFunctional: [
        'Strict state machine: Machine must never dispense an item in NoMoneyState or when payment is insufficient.',
        'Single Responsibility: Decouple inventory management from coin refund calculation.',
      ],
      constraints: [
        'If machine runs out of change coins, transaction must be rejected gracefully with full refund.',
      ],
    },
    keyEntities: [
      'VendingMachine',
      'VendingState',
      'Inventory',
      'Product',
      'Coin',
      'CashHandler',
      'ChangeDispenser',
    ],
    recommendedPatterns: [
      'State Pattern (IdleState, HasMoneyState, DispensingState, SoldOutState)',
      'Chain of Responsibility (for Change calculation across denominations)',
      'Factory Pattern (for Products and Coins)',
    ],
    evaluationChecklist: [
      {
        id: 'vm-state',
        name: 'State Pattern Enforcement',
        description: 'VendingMachine delegates actions to concrete state classes, eliminating nested if/switch statements.',
        importance: 'CRITICAL',
      },
      {
        id: 'vm-inventory',
        name: 'Inventory Cohesion',
        description: 'Inventory encapsulates product rack capacity and decrements stock only on successful dispense.',
        importance: 'IMPORTANT',
      },
    ],
    starterTemplates: [
      {
        label: 'Clean Starter (State Pattern Template)',
        description: 'Ready-to-complete vending machine state pattern skeleton.',
        content: {
          classDiagramUml: `classDiagram
    class VendingMachine {
        -VendingState currentState
        -Inventory inventory
        -int currentBalance
        +insertCoin(Coin coin)
        +selectItem(String code)
        +dispense()
        +cancel()
    }
    class VendingState {
        <<interface>>
        +insertCoin(Coin coin)
        +selectItem(String code)
        +dispense()
        +cancel()
    }
    VendingMachine --> VendingState
    VendingMachine --> Inventory`,
          entities: [
            {
              id: 'vm1',
              name: 'VendingMachine',
              type: 'class',
              responsibilities: 'Context holding current state, inventory, and inserted money balance.',
              fields: ['- state: VendingState', '- balance: number', '- inventory: Inventory'],
              methods: ['+ insertMoney(amount: number)', '+ selectCode(code: string)', '+ dispense()', '+ refund()'],
              relationships: [{ source: 'VendingMachine', target: 'VendingState', type: 'association' }, { source: 'VendingMachine', target: 'Inventory', type: 'composition' }],
            },
            {
              id: 'vm2',
              name: 'VendingState',
              type: 'interface',
              responsibilities: 'State contract defining valid actions in each phase.',
              fields: [],
              methods: ['+ insertMoney(amount: number): void', '+ selectCode(code: string): void', '+ dispense(): void', '+ cancel(): void'],
              relationships: [],
            },
          ],
          sourceCode: `export interface VendingState {
  insertCoin(vm: VendingMachine, amount: number): void;
  selectProduct(vm: VendingMachine, code: string): void;
  dispense(vm: VendingMachine): void;
  refund(vm: VendingMachine): void;
}

export class VendingMachine {
  private state!: VendingState;
  private balance: number = 0;

  constructor() {
    // initialize states
  }

  public setState(state: VendingState) {
    this.state = state;
  }
}`,
          designDecisions: {
            patternsUsed: 'State Pattern to model NoMoneyState, HasMoneyState, DispensingState, SoldOutState.',
            concurrencyStrategy: 'Synchronized transaction lock per vending machine instance to prevent simultaneous coin insertion/cancel races.',
            extensibilityNotes: 'Adding a new payment method (e.g. NFC Contactless card) adds a HasCardPaymentState without touching cash logic.',
            tradeoffsConsidered: 'State pattern creates more classes but removes error-prone switch statements.',
          },
        },
      },
    ],
    referenceSolution: {
      overview: 'Classic State pattern implementation with clean separation of money reservoir and inventory.',
      entities: [],
      sourceCode: `// Vending machine reference solution`,
      designDecisions: {
        patternsUsed: 'State, Strategy',
        concurrencyStrategy: 'Instance-level mutex',
        extensibilityNotes: 'Clean state hierarchy',
        tradeoffsConsidered: 'Class count vs state safety',
      },
      discussionNotes: 'Key discussion: what happens if dispensing mechanism jams midway?',
    },
  },
  {
    id: 'in-memory-pub-sub-broker',
    title: 'Design an In-Memory Pub/Sub Message Broker',
    category: 'Distributed & Messaging Systems',
    difficulty: 'HARD',
    estimatedMinutes: 40,
    brief:
      'Design a high-throughput, concurrent, in-memory publish-subscribe message broker (like a miniature Kafka or RabbitMQ) supporting topics, multiple consumer groups, offset tracking, retry, and dead letter queues.',
    requirements: {
      functional: [
        'Producers can publish messages to named Topics.',
        'Consumers can subscribe to Topics as individual subscribers or as part of a Consumer Group.',
        'Within a Consumer Group, each message is processed by only one consumer.',
        'Support offset tracking per subscriber and acknowledge (ACK/NACK) mechanics.',
        'Support Dead Letter Queue (DLQ) after max retries exceeded.',
      ],
      nonFunctional: [
        'High concurrency: Producers and consumers execute asynchronously across different worker threads.',
        'Order preservation: Messages on the same topic partition must be delivered sequentially.',
        'Non-blocking publish: Publishing to a topic should not block on slow consumers.',
      ],
      constraints: [
        'All data is stored in-memory with bounded queue sizes to prevent OutOfMemory errors.',
      ],
    },
    keyEntities: [
      'MessageBroker',
      'Topic',
      'Message',
      'Subscriber',
      'ConsumerGroup',
      'OffsetManager',
      'DeadLetterQueue',
    ],
    recommendedPatterns: [
      'Observer Pattern (for event dispatching)',
      'Producer-Consumer Pattern (with BlockingQueue / RingBuffer)',
      'Singleton Pattern (for Broker Registry)',
    ],
    evaluationChecklist: [
      {
        id: 'pubsub-concurrency',
        name: 'Thread Safety & Non-blocking Queues',
        description: 'Decoupled asynchronous worker threads ensuring publisher is not blocked by slow consumer.',
        importance: 'CRITICAL',
      },
      {
        id: 'pubsub-group',
        name: 'Consumer Group Partitioning',
        description: 'Clean abstraction representing broadcast vs consumer group load balancing.',
        importance: 'CRITICAL',
      },
    ],
    starterTemplates: [
      {
        label: 'Guided Starter (Topic & Consumer Group)',
        description: 'Topic, Subscriber, and Offset management boilerplate.',
        content: {
          classDiagramUml: `classDiagram
    class MessageBroker {
        -Map~String, Topic~ topics
        +publish(String topicName, Message msg)
        +subscribe(String topicName, ISubscriber sub)
    }
    class Topic {
        -String name
        -List~Message~ messages
        -List~ISubscriber~ subscribers
        +addMessage(Message msg)
    }
    class ISubscriber {
        <<interface>>
        +consume(Message msg) boolean
    }
    MessageBroker --> Topic
    Topic --> ISubscriber`,
          entities: [
            {
              id: 'ps1',
              name: 'MessageBroker',
              type: 'class',
              responsibilities: 'Coordinates topic registry and lifecycle.',
              fields: ['- topics: Map<string, Topic>'],
              methods: ['+ createTopic(name: string): Topic', '+ publish(topic: string, msg: Message): void'],
              relationships: [{ source: 'MessageBroker', target: 'Topic', type: 'composition' }],
            },
            {
              id: 'ps2',
              name: 'ISubscriber',
              type: 'interface',
              responsibilities: 'Callback contract for message consumers.',
              fields: [],
              methods: ['+ onMessage(msg: Message): boolean'],
              relationships: [],
            },
          ],
          sourceCode: `export interface ISubscriber {
  readonly id: string;
  onMessage(message: Message): Promise<boolean>;
}

export class Message {
  constructor(public readonly id: string, public readonly payload: any, public readonly timestamp: Date = new Date()) {}
}

export class Topic {
  private subscribers: ISubscriber[] = [];
  private messageLog: Message[] = [];

  constructor(public readonly name: string) {}

  public synchronizedPublish(message: Message): void {
    this.messageLog.push(message);
    // Asynchronous dispatch to subscribers
    for (const sub of this.subscribers) {
      setTimeout(() => sub.onMessage(message), 0);
    }
  }
}`,
          designDecisions: {
            patternsUsed: 'Observer Pattern, Producer-Consumer with bounded in-memory ring buffers.',
            concurrencyStrategy: 'ReadWriteLock per Topic to allow high concurrency reads by multiple consumers while serializing appends.',
            extensibilityNotes: 'Pluggable storage engine (in-memory vs file-backed) via IMessageStore interface.',
            tradeoffsConsidered: 'Trade-off: In-memory offset map instead of distributed zookeeper for ultra-low latency.',
          },
        },
      },
    ],
    referenceSolution: {
      overview: 'Complete broker design with offset commits and backpressure.',
      entities: [],
      sourceCode: `// Pub-sub reference broker`,
      designDecisions: {
        patternsUsed: 'Observer, Strategy',
        concurrencyStrategy: 'ConcurrentLinkedQueue with ReadWriteLocks',
        extensibilityNotes: 'Pluggable delivery semantics (At-least-once vs At-most-once)',
        tradeoffsConsidered: 'Throughput vs persistence guarantees',
      },
      discussionNotes: 'Discuss handling poison pills and slow consumers falling behind the retention window.',
    },
  },
  {
    id: 'lru-cache-with-ttl',
    title: 'Design an LRU Cache with TTL Expiration',
    category: 'Data Structure & Concurrency',
    difficulty: 'MEDIUM',
    estimatedMinutes: 30,
    brief:
      'Design a thread-safe, bounded Least Recently Used (LRU) cache supporting $O(1)$ get and put operations, alongside per-entry Time-To-Live (TTL) expiration and pluggable eviction strategies.',
    requirements: {
      functional: [
        'Fixed maximum capacity specified at initialization.',
        'get(key): Returns value and marks key as most recently used in $O(1)$. If expired, returns null.',
        'put(key, value, ttlSeconds?): Inserts or updates key; if capacity exceeded, evicts Least Recently Used key in $O(1)$.',
        'Automatic cleanup of expired TTL entries without degrading get/put throughput.',
      ],
      nonFunctional: [
        'Thread safety: Support concurrent reads and writes from multiple threads without data corruption.',
        'Extensibility: Eviction strategy should follow the Strategy Pattern (LRU, LFU, FIFO).',
      ],
      constraints: [
        '$O(1)$ time complexity for get, put, and eviction.',
      ],
    },
    keyEntities: [
      'Cache',
      'DoublyLinkedList',
      'Node',
      'EvictionStrategy',
      'ExpirationManager',
    ],
    recommendedPatterns: [
      'Strategy Pattern (for Eviction policies: LRU vs LFU vs FIFO)',
      'Decorator Pattern (for adding Metrics / TTL layers around a raw cache)',
    ],
    evaluationChecklist: [
      {
        id: 'lru-complexity',
        name: 'O(1) Access and Eviction Structure',
        description: 'Combines Hash Map and Doubly Linked List to ensure true O(1) operations.',
        importance: 'CRITICAL',
      },
      {
        id: 'lru-concurrency',
        name: 'Thread Safety Strategy',
        description: 'ReadWriteLock or Segmented locking to prevent race conditions during node relocation.',
        importance: 'CRITICAL',
      },
    ],
    starterTemplates: [
      {
        label: 'Guided Starter (Map + DoublyLinkedList)',
        description: 'Node, DoublyLinkedList, and thread-safe Cache template.',
        content: {
          classDiagramUml: `classDiagram
    class Cache {
        -int capacity
        -Map~K, Node~ map
        -DoublyLinkedList list
        +get(K key) V
        +put(K key, V value, int ttl)
    }
    class Node {
        -K key
        -V value
        -long expireAt
        -Node prev
        -Node next
    }
    class DoublyLinkedList {
        +addFirst(Node node)
        +moveToFront(Node node)
        +removeLast() Node
    }
    Cache --> DoublyLinkedList
    DoublyLinkedList --> Node`,
          entities: [
            {
              id: 'c1',
              name: 'Cache',
              type: 'class',
              responsibilities: 'Core key-value coordinator implementing eviction and expiry.',
              fields: ['- capacity: number', '- map: Map<K, Node<K, V>>', '- list: DoublyLinkedList<K, V>'],
              methods: ['+ get(key: K): V | null', '+ put(key: K, value: V, ttlMs?: number): void'],
              relationships: [{ source: 'Cache', target: 'DoublyLinkedList', type: 'composition' }],
            },
          ],
          sourceCode: `export class Node<K, V> {
  public prev: Node<K, V> | null = null;
  public next: Node<K, V> | null = null;
  constructor(public key: K, public value: V, public expireAt: number = Infinity) {}
}

export class DoublyLinkedList<K, V> {
  private head: Node<K, V> = new Node(null as any, null as any);
  private tail: Node<K, V> = new Node(null as any, null as any);

  constructor() {
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  public addFirst(node: Node<K, V>) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next!.prev = node;
    this.head.next = node;
  }

  public remove(node: Node<K, V>) {
    node.prev!.next = node.next;
    node.next!.prev = node.prev;
  }

  public removeLast(): Node<K, V> | null {
    if (this.tail.prev === this.head) return null;
    const last = this.tail.prev!;
    this.remove(last);
    return last;
  }
}`,
          designDecisions: {
            patternsUsed: 'Strategy Pattern for Eviction Policies; Decorator pattern for Expiration/TTL handling.',
            concurrencyStrategy: 'ReadWriteLock (shared read lock on cache hits, exclusive write lock on node repointing).',
            extensibilityNotes: 'Eviction policy can be swapped with LFU (Least Frequently Used) by injecting IEvictionStrategy.',
            tradeoffsConsidered: 'Trade-off: Passive expiration on get() plus a background cron timer instead of per-key timers to conserve memory and threads.',
          },
        },
      },
    ],
    referenceSolution: {
      overview: 'Segmented LRU Cache with active passive TTL eviction and lock striping.',
      entities: [],
      sourceCode: `// Complete LRU Cache with TTL`,
      designDecisions: {
        patternsUsed: 'Strategy, Decorator',
        concurrencyStrategy: 'Striped ReadWriteLocks for high throughput',
        extensibilityNotes: 'Pluggable storage backend',
        tradeoffsConsidered: 'Lock granularity vs memory overhead',
      },
      discussionNotes: 'How to prevent thundering herd when a popular cache key expires.',
    },
  },
];
