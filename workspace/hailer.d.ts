/**
 * Hailer API types and interfaces
 */

type HailerCredentials = {
  email?: string;
  password?: string;
  userApiKey?: string;
};

// Core User Types
type HailerCurrentUser = {
  _id: string;
  created: number;
  calendars?: string[];
  default_company?: string;
  default_profilepic: string;
  display_name?: string;
  email?: string;
  firstname: string;
  lastname: string;
  profilepics?: string[];
  emailVerified?: boolean;
  settings?: Record<string, unknown>;
  globalSettings?: {
    feedPostEmail: boolean;
    discussionMessageEmail: boolean;
  };
  preferredLanguages?: string[];
  lastSeen: number;
  localauth?: boolean;
};

type HailerUser = {
  _id: string;
  firstname: string;
  lastname: string;
  default_profilepic: string;
  companies: string[];
  lastLocation?: {
    lat: number;
    lng: number;
    name: string;
    time: number;
  };
  status?: string;
  lastSeen: number;
};

// Workspace (Network) Types
type HailerWorkspace = {
  _id: string;
  name: string;
  uid: string;
  created: number;
  updated: number;
  members: Array<{
    uid: string;
    title?: string;
    owner?: boolean;
    admin?: boolean;
    joined?: number;
    inviter?: string;
  }>;
  settings: {
    defaultView?: string;
    allowPublicCopy?: boolean;
    languages?: string[];
    [key: string]: unknown;
  };
  license: {
    type: string;
    activated: number;
    override?: Record<string, unknown>;
    payment?: Record<string, unknown>;
    tokens?: {
      balance?: number;
      lastUpdated?: number;
    };
  };
  description?: string;
  version?: number;
  invoicing?: {
    fixedMonthlyFee: number;
    perUserMonthlyFee: number;
    externalUserCount: number;
    paymentMethod: string;
    paymentStructure: string;
    trialUsed: boolean;
  };
};

// Workflow (Process) Types which is recieved from Hailer API when core.init is called
type HailerWorkflow = {
  _id: string;
  name: string;
  description?: string | null;
  defaultView?: "table" | "kanban" | "wall" | "calendar";
  cid: string; // workspace/network id
  uid: string; // user id who created it
  created?: number;
  updated?: number;

  // Fields
  fields?: Record<string, HailerField>;
  fieldsOrder: string[];

  // Phases
  phases?: Record<string, HailerPhase>;
  phasesOrder: string[];
  phasesRemoved?: string[];

  // Members - can be user or network members
  members: Array<HailerMember>;

  // Settings flags
  enableAddedField?: boolean;
  enableLinkedAnnouncements?: boolean;
  enableMapLocation?: boolean;
  enableUnlinkedMode?: boolean;
  enableMessenger?: boolean;
  enableModifiedField?: boolean;
  enableUniqueName?: boolean;
  enablePreselectedTeam?: boolean;
  enableAttachments?: boolean;
  enableOwnerField?: boolean;
  enableOwnerTeamField?: boolean;
  enableGuestEditing?: boolean;
  enablePredefinedName?: boolean;
  enableActivityTagging?: boolean;

  // Guest settings
  allowGuests?: boolean;

  // Team settings
  preselectedTeam?: {
    team: string;
    account: string;
  };
  autoPickPreselectedTeam?: boolean;

  // Name settings
  nameFieldPlaceHolderText?: string | null;
  nameColumnText?: string | null;
  nameEditable?: boolean;
  nameFunctionEnabled?: boolean;
  nameFunction?: string;
  nameFunctionVariables?: {
    [variableName: string]: HailerFieldFunctionVariable | HailerFieldFunctionVariable[];
  };
  predefinedNamePrefix?: string | null;

  // UI settings
  order?: number;
  coverImage?: string;
  createNewLabel?: string;
  initPhaseDescription?: string | null;
  personInChargeLabel?: string | null;
  personInCharge?: string | null;
  ownerTeamFieldTitle?: string | null;

  // Other settings
  translations?: HailerTranslations;
  createdActivities?: number;
  inviteActivityCreator?: boolean;
  discussionPermissions?: DiscussionPermission[];
  publicForm?: HailerPublicForm;
  groupNames?: string[];
  documentTemplates?: Record<string, DocumentTemplate>;
  isStarred?: boolean;
  version?: number;

  /** To know what is installed via market place */
  workflowSuite?: {
    productId: string;
    name: string;
    packageHash: string;
    created: number;
  };

  /** Custom unique identifier */
  key?: string | null;
};

type HailerWorkflowImmutableFields
  = | "_id"
    | "cid"
    | "uid"
    | "created"
    | "updated"
    | "isStarred"
    | "version"
    | "publicForm"
    | "documentTemplates"
    | "workflowSuite";

// Fields that the process.set_info endpoint is expecting
type HailerWorkflowUpdatePayload = Omit<
  HailerWorkflow,
  HailerWorkflowImmutableFields
> & {
  _id?: string;
  locationRequired?: boolean;
  tags?: string[];
  allowMultipleTags?: boolean | null;
  allowCustomTags?: boolean | null;
  requireFileTag?: boolean | null;
  defaultGroupByField?: string | null;
  color?: string | null;
  activityTaggingPhaseIds?: string[];
};

type HailerFieldFunctionVariable = {
  type: "<" | ">" | "=" | "?";
  data: string[];
  /**
   * Only for "<" (linked-from): the activitylink field on the source workflow that must point to
   * this activity. Omit it to match any link field.
   */
  sourceActivityLinkFieldId?: string;
};

/**
 * The field being evaluated, available in Fast Functions code as the global `self`.
 * Reading it adds no dependency.
 */
type HailerFunctionSelf = {
  /** The field value captured when the evaluation starts; may include an unsaved form edit */
  value: unknown;
  /** false only for null or undefined */
  hasValue: boolean;
  isEditable: boolean;
  type: HailerFieldType;
  fieldId: string;
  activityId: string;
  /** Activity metadata; unlike a "data" dependency it has no name */
  data: {
    _id: string;
    process: string;
    phase: string;
    created: number;
    updated: number;
    completed: number | null;
    processName: string;
    phaseName: string;
    sequence: number;
    priority?: number;
  };
};

declare const self: HailerFunctionSelf;

type HailerField = {
  _id: string;
  type: HailerFieldType;
  // Custom unique identifier
  key?: string | null;
  label?: string;
  required?: boolean;
  data?: unknown[];
  description?: string | null;
  placeholder?: string | null;

  // Function-related properties
  functionEnabled?: boolean;
  function?: string;
  functionVariables?: {
    [variableName: string]: HailerFieldFunctionVariable | HailerFieldFunctionVariable[];
  };
  // Default values
  defaultTo?: boolean;
  defaultValue?: unknown;

  // Metadata
  created?: number;
  updated?: number;
  uid?: string;

  unit?: string | null;
  inviteToDiscussionOnChange?: boolean;
  editable?: boolean;
  collapsedByDefault?: boolean;

  reminderEnabled?: boolean;
  reminderSettings?: {
    fieldOffset: {
      milliseconds: number;
      days: number;
      months: number;
      beforeOrAfter: "before" | "after";
    };
    users: string[];
    teams: string[];
    fields: string[];
    phases: string[];
    activityOwner: boolean;
    activityOwnerTeam: boolean;
    activityParticipants: boolean;
    reminderText: string;
  };
  modifier?: {
    checkbox?: boolean;
    file?: boolean;
    matchAllFieldFilters?: boolean;
    quickAdd?: {
      targetFieldId: string;
      fieldIds?: string[];
    };
    activityFieldFilters?: Array<{
      targetWorkflowId: string;
      sourceFieldId: string;
      targetFieldId: string;
    }>;
  };
};

type HailerFieldImmutableFields = "uid" | "created" | "updated" | "_id" | "type";

type HailerFieldGeneric = Omit<
  HailerField,
  HailerFieldImmutableFields
> & {
  _id?: string;
  type?: HailerFieldType;
};

type HailerFieldCreatePayload = Omit<
  HailerField,
  HailerFieldImmutableFields
> & {
  type: HailerFieldType;
};

type HailerFieldUpdatePayload = Omit<
  HailerField,
  HailerFieldImmutableFields
> & {};

type HailerPhaseMember = Omit<HailerMember, "permissions"> & {
  permissions: Array<"edit">;
};

type HailerPhase = {
  _id: string;
  name: string;
  description?: string | null;

  // Metadata
  uid?: string;
  created?: number;

  // UI properties
  color?: string | null;
  order?: number;

  // Field configuration
  fields?: string[]; // Array of field IDs
  announcementFields?: string[];
  announcementRecipients?: string[];
  announcementFieldsOrder?: string[];

  // Phase behavior
  isInitial?: boolean;
  isEndpoint?: boolean;
  possibleNextPhase?: string[];
  possibleNextPhaseSettings?: Record<
    string,
    {
      text?: string;
      name?: string;
      description?: string;
      [key: string]: unknown;
    }
  >;

  // Primary fields
  primaryDateField?: "created" | "updated" | "completedOn" | null;
  primaryNumericField?: string | null;

  // Announcement settings
  enableAnnouncement?: boolean;

  // Members and followers
  members?: HailerPhaseMember[];
  followers?: string[];

  // Webhook configuration
  webhooksEnabled?: boolean;
  webhookUrl?: string;
  webhookAdded?: boolean;
  webhookUpdated?: boolean;

  // Custom unique identifier
  key?: string | null;
};

type HailerPhaseImmutableFields
  = | "uid"
    | "created"
    | "order"
    | "_id";

type HailerPhaseUpdatePayload = Omit<
  HailerPhase,
  HailerPhaseImmutableFields
> & {
  announcementToOwner?: boolean;
  announcementToOwnerTeam?: boolean;
  announcementAllowPrivateReply?: boolean;
  fieldOptions?: {
    eventDateField?: string | null;
    tableDeadlineField?: string | null;
  };
  _id?: string;
};

type HailerTranslations = {
  en?: TranslationContent;
  fi?: TranslationContent;
  sv?: TranslationContent;
};

type TranslationContent = {
  name: string;
  nameColumnText?: string;
  nameFieldPlaceHolderText?: string;
  personInChargeLabel?: string;

  predefinedNamePrefix?: string;
  createNewLabel?: string;
  description?: string;
  fields: {
    [fieldId: string]: {
      defaultValue?: string;
      placeholder?: string;
      label?: string;
      unit?: string;
      description?: string;
    };
  };
  phases?: {
    [phaseId: string]: {
      name: string;
      description?: string;
      possibleNextPhaseSettings?: {
        [nextPhaseId: string]: {
          text: string;
        };
      };
    };
  };
};

type DiscussionPermission
  = | "discussion.message.add"
    | "discussion.message.add.attachment"
    | "discussion.read.history"
    | "discussion.message.remove.own"
    | "discussion.leave";

type HailerPublicForm = {
  active: boolean;
  allowRead: boolean;
  creator: string;
  enableMessaging: boolean;
  followers: string;
  key: string;
  team_account: {
    account: string;
    team: string;
  };
  theme: {
    backgroundColor: string;
    complementaryColor: string;
    foregroundColor: string;
    headerColor: string;
    logoId: string;
    textColor: string;
  };
};

// Team and Account Types
type HailerTeam = {
  _id: string;
  name: string;
  public: boolean;
  uid: string;
  members: string[];
  description?: string;
  cid: string;
  accounts?: string[];
  created: number;
  updated: number;
  defaultView?: {
    type: "app" | "hailer" | "custom";
    value: "discussions" | "feed" | "events" | "activities" | string;
  };
};

type HailerTeamImmutableFields
  = | "_id"
    | "cid"
    | "uid"
    | "created"
    | "updated"
    | "accounts"
    | "members"
    | "public";

type HailerTeamUpdatePayload = Omit<
  HailerTeam,
  HailerTeamImmutableFields
> & {
  _id?: string;
  members?: string[];
  public?: boolean;
};

type HailerAccount = {
  _id: string;
  cid: string;
  color?: string;
  created: number;
  name: string;
  team_id: string;
  uid: string;
};

type HailerGroup = {
  _id: string;
  name: string;
  description?: string;
  cid: string;
  uid: string;
  created: number;
  updated: number;
  groups: string[];
  teams: string[];
  users: string[];
  public?: boolean;
};

type HailerGroupImmutableFields
  = | "_id"
    | "cid"
    | "uid"
    | "created"
    | "updated"
    | "teams"
    | "groups"
    | "users";

type HailerGroupUpdatePayload = Omit<
  HailerGroup,
  HailerGroupImmutableFields
> & {
  _id?: string;
  teams?: string[];
  groups?: string[];
  users?: string[];
};

type HailerTag = {
  _id: string;
  value: string;
  cid: string;
  uid: string;
  created: number;
};

// App Types

/**
 * Allowed app-icon gradient ids.
 *
 * Curated server-side list (api `src/modules/apps/icon-generator.ts` → `APP_ICON_GRADIENTS`).
 * The live source of truth is the `v3.app.icon.options` endpoint; this union is a static mirror
 * so workspace-building agents know the valid values at author time. Keep in sync if the API list changes.
 */
type AppIconGradientId
  = | "blue-purple"
    | "purple-pink"
    | "pink-orange"
    | "orange-amber"
    | "teal-blue"
    | "indigo-purple"
    | "red-pink"
    | "sky-indigo"
    | "cyan-green"
    | "amber-red"
    | "lime-teal"
    | "slate-blue";

/**
 * Allowed app-icon symbol ids (Lucide glyphs).
 *
 * Curated server-side list (api `src/modules/apps/icon-generator.ts` → `APP_ICON_SYMBOLS`).
 * Mirrors `v3.app.icon.options`; keep in sync if the API list changes. The trailing comment
 * on each line is the picker label.
 */
type AppIconSymbolId
  = | "chart-column" //      Bar Chart
    | "chart-spline" //      Trend
    | "chart-pie" //         Pie
    | "database" //          Database
    | "square-function" //   Function
    | "file" //              File
    | "folder" //            Folder
    | "notebook" //          Notebook
    | "book-open-text" //    Book
    | "list-checks" //       List
    | "calendar-clock" //    Calendar
    | "wrench" //            Wrench
    | "cable" //             Cable
    | "microscope" //        Microscope
    | "telescope" //         Telescope
    | "zap" //               Zap
    | "globe" //             Globe
    | "key-round" //         Key
    | "key-square" //        Key Square
    | "mail" //              Mail
    | "info" //              Info
    | "music-4" //           Music
    | "shopping-cart" //     Cart
    | "home" //              Home
    | "factory" //           Factory
    | "briefcase" //         Briefcase
    | "rocket" //            Rocket
    | "truck" //             Truck
    | "ship" //              Ship
    | "sailboat" //          Sailboat
    | "ship-wheel" //        Wheel
    | "traffic-cone" //      Cone
    | "ghost" //             Ghost
    | "panda" //             Panda
    | "rat" //               Rat
    | "leaf" //              Leaf
    | "sprout" //            Sprout
    | "flame" //             Flame
    | "droplet" //           Droplet
    | "rainbow" //           Rainbow
    | "umbrella" //          Umbrella
    | "beer" //              Beer
    | "utensils" //          Utensils
    | "carrot" //            Carrot
    | "chef-hat" //          Chef
    | "heart" //             Heart
    | "sparkles" //          Sparkles
    | "wand-sparkles" //     Wand
    | "crown" //             Crown
    | "gem" //               Gem
    | "target" //            Target
    | "puzzle" //            Puzzle
    | "spade" //             Spade
    | "shield" //            Shield
    | "life-buoy"; //        Life Buoy

/** Icon recipe: server renders `icon`/`iconBadge` file ids from this. */
type AppIconGenerator = {
  gradientId: AppIconGradientId;
  symbolId: AppIconSymbolId;
};

type HailerApp = {
  _id: string;
  uid: string;
  name: string;
  // Clear with "": the API rejects null
  description?: string;
  cid: string; // workspace/network id

  created: number;
  updated: number;

  members: Array<HailerMember>;

  // gitUrl is optional git repository URL that users can set into their app configuration
  gitUrl?: string | null;

  // App URLs
  url: string;
  allowedUrls: string[];

  // Configuration
  config: Record<string, unknown> | null;

  // Optional app metadata
  /** @deprecated Superseded by `iconGenerator`. Still accepted by the API for older app-sdk compatibility; the Hailer UI no longer sends it. */
  image?: string;
  /** Server-rendered glyph file id (generated from `iconGenerator`). */
  icon?: string;
  /** Server-rendered badge file id (generated from `iconGenerator`). */
  iconBadge?: string;
  /** Editable icon recipe; server regenerates `icon`/`iconBadge` when it changes. */
  iconGenerator?: AppIconGenerator;
  packageHash?: string;
  isProductVersionAvailable?: boolean;
  type?: string;
  enabled?: boolean;

  // Allow additional properties for flexibility
  // [key: string]: unknown;
};

type HailerAppImmutableFields
  = | "_id"
    | "cid"
    | "uid"
    | "created"
    | "updated"
    | "packageHash"
    | "config"
    | "enabled"
    | "allowedUrls"
    | "isProductVersionAvailable"
    | "type"
    // Deprecated and server-managed for marketplace apps; not pushed (use `iconGenerator` instead).
    | "image"
    // Server-rendered from `iconGenerator`; never sent back on push.
    | "icon"
    | "iconBadge";

type HailerAppUpdatePayload = Omit<HailerApp, HailerAppImmutableFields> & {
  _id?: string;
};

// Member ID format enforced by template literal type
type HailerMemberId = `user_${string}` | `team_${string}` | `group_${string}` | `network_${string}`;

type HailerMember = {
  id: HailerMemberId;
  info: Record<string, unknown>;
  permissions: Array<"any" | "own" | "ownteam" | "admin">;
};

// Main Response Types
type HailerTimestamps = {
  users: number;
  networks: number;
  processes: number;
  teams: number;
};

type HailerCoreDataResponse = {
  timestamp: HailerTimestamps;
  user: HailerCurrentUser;
  users: Record<string, HailerUser>;
  network: HailerWorkspace;
  networks: Record<string, HailerWorkspace>;
  processes: HailerWorkflow[];
  teams: Record<string, Record<string, HailerTeam>>;
  accounts: Record<string, Record<string, HailerAccount>>;
  groups?: Record<string, Record<string, HailerGroup>>;
  tags?: Record<string, Record<string, HailerTag>>;
  apps?: Record<string, Record<string, HailerApp>>;
};

type HailerFieldType
  = | "activitylink"
    | "country"
    | "date"
    | "daterange"
    | "datetime"
    | "datetimerange"
    | "numeric"
    | "numericunit"
    | "teams"
    | "text"
    | "textarea"
    | "textunit"
    | "textpredefinedoptions"
    | "time"
    | "timerange"
    | "users"
    | "linkedfrom"
    | "subheader";

type HailerNetworksResponse = {
  networks: Record<string, HailerWorkspace>;
};

type WorkflowEntry = {
  _id?: string;
  name: string;
  folder?: string;
  enableUnlinkedMode?: boolean;
};

type CreateWorkflowPayload = {
  name: string;
  description?: string;
  defaultView?: string;
  workspaceId: string;
  enableMapLocation?: boolean;
  enableUnlinkedMode?: boolean;
  enableUniqueName?: boolean;
  defaultGroupByField?: string;
};

type HailerErrorResponse = {
  code: number;
  msg: string;
  debug: {
    op: string;
    args: string[];
  };
};

type HailerInsight = {
  _id: string;
  created: number;
  updated: number;
  name: string;
  members: Array<{
    id: string;
    info: Record<string, unknown>;
    permissions: ["edit"] | [];
  }>;
  public: boolean;
  publicKey: string;
  uid: string;
  cid: string;
  query: string;
  sources: [
    {
      workflowId: string;
      name: string;
      fields: Array<{
        name: string;
        meta?: "_id"
          | "uid"
          | "team"
          | "createdBy"
          | "name"
          | "created"
          | "updated"
          | "phaseId"
          | "phaseName"
          | "phaseLastMove"
          | "workflowId"
          | "workflowName"
          | "priority";
        fieldId?: string;
        phaseId?: string;
      }>;
    },
    ...Array<{
      workflowId: string;
      name: string;
      fields: Array<{
        name: string;
        meta?: "_id"
          | "uid"
          | "team"
          | "createdBy"
          | "name"
          | "created"
          | "updated"
          | "phaseId"
          | "phaseName"
          | "phaseLastMove"
          | "workflowId"
          | "workflowName"
          | "priority";
        fieldId?: string;
        phaseId?: string;
      }>;
    }>
  ];
  presets?: unknown[];
};

type HailerInsightImmutableFields
  = | "_id"
    | "created"
    | "updated"
    | "publicKey"
    | "uid"
    | "cid";

type HailerInsightPayload = Omit<
  HailerInsight,
  HailerInsightImmutableFields
> & {
  _id?: string;
};

type HailerTeamUserRole = "user" | "inviter" | "guest" | "admin" | "owner";

type SendWorkspaceInvitationResponse = {
  email: string;
  role: HailerTeamUserRole;
  title: string;
  teams: string[];
  created: number;
  invited_by: string;
  invite_key: string;
  _id: string;
};

// Document template
type DocumentTemplateFieldMapItem = {
  value?: string;
  label?: string;
  description?: string;
};

type DocumentTemplateImageMapItem = {
  value?: string;
  description?: string;
};

type DocumentTemplateActivityLinkItem = {
  field?: string;
  label?: string;
  process?: string;
  description?: string;
};

type DocumentTemplateFieldMap = {
  staticActivityIds: string;
  images: {
    [key: string]: DocumentTemplateImageMapItem;
  };
  activityLinks: {
    [key: string]: DocumentTemplateActivityLinkItem;
  };
  fields: {
    [key: string]: DocumentTemplateFieldMapItem;
  };
};

type DocumentTemplateOptions = {
  formatFieldValue: boolean;
  thousandSeparator?: "" | " " | ",";
  decimalSeparator?: "." | ",";
  toFixedDigits?: "" | "0" | "1" | "2" | "3";
  toFixedIds?: string;
  linkedActivitiesFilteredPhases?: string;
};

type DocumentTemplate = {
  name: string;
  order?: number;
  opts?: DocumentTemplateOptions;
  fieldMap?: DocumentTemplateFieldMap;
  templateId: string;
};

type UpdateWorkflowTemplatesPayload = {
  name: string;
  order?: number;
  opts?: DocumentTemplateOptions;
  fieldMap?: DocumentTemplateFieldMap;
  templateId?: string;
};

type GetDocumentTemplateResponse = {
  _id: string;
  description: string;
  global: boolean;
  fileType: "csv" | "pdf";
  content: string;
  ownerCids: string[];
  configuration: DocumentTemplate;
  created: number;
  updated: number;
  uid: string;
};

type DocumentTemplateUpdatePayload = DocumentTemplate
  & Pick<GetDocumentTemplateResponse, "global" | "fileType" | "content" | "description">;

type DocumentTemplateCodeUpdatePayload = Pick<DocumentTemplate, "templateId"> & Pick<GetDocumentTemplateResponse, "global" | "fileType" | "content" | "description">;

type DocumentTemplateEntry = {
  templateId?: string;
  name: string;
  fileType: "csv" | "pdf";
  folder?: string;
};

type CreateDocumentTemplatePayload = Omit<GetDocumentTemplateResponse, "_id" | "created" | "updated" | "uid" | "configuration"> & {
  procesId?: string;
  cid?: string;
};

// TYPES FROM HAILER BACKEND - THESE TYPES ARE COPIED DIRECTLY FROM THE HAILER BACKEND RELATED TO VAROIUS FEATURES. SOMEWHERE INSTEAD OF COPYING EVERYTHING THERE IS USED TYPE "unknown" WITH A COMMENT THAT THE CORRECT TYPE CAN BE FOUND IN THE BACKEND.

type Syncable = {
  /** Document Id */
  _id: string;
  /** Document store hash */
  // eslint-disable-next-line node/prefer-global/buffer
  hash?: Buffer;
  /** User Id */
  uid: string;
  /** Network Id */
  cid?: string;
  /** Creation timestamp (milliseconds since Jan 1st 1970) */
  created: number;
  /** Updated timestamp (rendered if updated) */
  updated?: number;
  /** Removed timestamp (rendered if removed) */
  removed?: number;
};

type NumericFieldType = (
    "numeric"
    | "numericunit"
    | "date"
    | "time"
    | "datetime"
);

type RangeFieldType = (
    "daterange"
    | "timerange"
    | "datetimerange"
);

type FieldType = (
    "activitylink"
    | "country"
    | "teams"
    | "text"
    | "textarea"
    | "textunit"
    | "textpredefinedoptions"
    | "users"
    | NumericFieldType
    | RangeFieldType
);

type ActivityLinkField = {
  _id: string;
  name: string;
};

type ActivityFieldRange = {
  start: number;
  end: number;
};

type ActivityField = {
  /** FieldId */
  id: string;
  /** Named field (used for integrations etc) */
  name?: string;
  /** Field value */
  value: string | number | boolean | { "country-code": string; "code": string; "name": string } | ActivityFieldRange | ActivityLinkField;
  /** Type of field,  */
  type: FieldType;
  /** Evaluation error */
  error?: string;
};

type ActivityDoc = {
  /** Name of activity */
  name: string;
  /** Not in db, determined by checking if in an endpoint phase */
  active?: boolean;
  /** Process Id to which this activity belongs */
  process: string;
  /** Network Id */
  cid: string;
  /** List of files attached to this activity */
  files: string[];
  /** Follower userIds */
  followers: string[];
  /** List of field changes and phases */
  history?: {
    phase: string;
    uid: string;
    updated: number;
    name: string;
    files: string[];
    fields: ActivityField[];
    [fieldId: string]: {
      value: string | number | boolean | { "country-code": string; "code": string; "name": string } | { start: number; end: number } | ActivityLinkField;
    } | string | string[] | number | ActivityField[];
  }[];
  /** Owning team and account */
  team_account: TeamAccount;
  /** PhaseId of current phase  */
  currentPhase: string;
  /**  */
  completePhases?: [];
  /** DiscussionId */
  discussion: string;
  /** Custom field values */
  fields: ActivityField[];
  /** Priority of activity, used for kanban view */
  priority?: number;
  /** Timestamp from completion */
  completedOn?: number;
  /** Activity location info */
  location?: ActivityLocation;
  sequence?: number;
} & Syncable;

type TeamAccount = {
  /** Team Id */
  team: string;
  /** Account Id */
  account: string;
};
type ActivityLocation = {
  data: {
    lat: number;
    lng: number;
  }[];
  label?: string;
  type: "area" | "point" | "polyline";
};

type ProcessTranslations = {
  name?: string;
  fields?: FieldTranslationsMap;
  nameFieldPlaceHolderText?: string;
  phases?: PhaseTranslationsMap;
  description?: string;
  nameColumnText?: string;
  predefinedNamePrefix?: string;
  createNewLabel?: string;
  personInChargeLabel?: string;
  initPhaseDescription?: string;
  ownerTeamFieldTitle?: string;
};
type FieldTranslations = {
  label?: string;
  unit?: string;
  placeholder?: string;
  description?: string;
  defaultValue?: string;
  data?: string[];
};

type ProcessTranslationsMap = {
  [language: string]: ProcessTranslations;
};
type FieldTranslationsMap = {
  [fieldId: string]: FieldTranslations;
};
type PhaseTranslations = {
  name?: string;
  description?: string;
  possibleNextPhaseSettings?: { [phaseId: string]: { text: string } };
};

type PhaseTranslationsMap = {
  [phaseId: string]: PhaseTranslations;
};

type MemberDoc = {
  id: string;
  info: { [key: string]: string | number | boolean | null };
  permissions: PermissionType[];
};

type PermissionType = "admin" | "own" | "ownteam" | "any" | "edit";
type ProcessFieldDoc = { } & ProcessField & Syncable;
type ProcessField = {
  label: string;
  required?: boolean;
  editable?: boolean;
  placeholder?: string;
  description?: string;
  type: HailerFieldType;
  /**
   * Depends on type:
   *
   * ```ts
   * activitylink: ProcessId[]
   * ```
   *
   * ```ts
   * textpredefinedoptions: string[]
   * ```
   */
  data?: string[];
  unit?: string;
  defaultTo?: boolean;
  defaultValue?: string;
  /** Javascript code to run on this field */
  function?: string;
  /** Depencencies and variables declared for this function */
  functionVariables?: FunctionDependencies;
  /** Function enabled, use code from `function` */
  functionEnabled?: boolean;
  /** Invite user selected in this field the the related discussion */
  inviteToDiscussionOnChange?: boolean;
  collapsedByDefault?: boolean;
  reminderEnabled?: boolean;
  // Correct type is ReminderSettings (check backend types in hailer-api)
  reminderSettings?: unknown;
  // Correct type is WorkflowFieldModifier (check backend types in hailer-api)
  modifier?: unknown;
  key?: string;
};
type FunctionDependencies = {
  [name: string]: Dependency | Dependency[];
};

type Dependency = {
  /**
   * Dependency type
   *
   * `>` Linked to
   * `<` Linked from
   * `=` Activity field
   * `?` Workflow/Phase static fields
   */
  type: "<" | ">" | "=" | "?";
  data: string[];
};

type ProcessDoc = {
  _id: string;
  cid: string;
  name: string;
  description?: string;
  defaultView: "table" | "kanban" | "map" | "calendar";
  /** Translations */
  translations?: ProcessTranslationsMap;
  /** Fields in process */
  fields: { [fieldId: string]: ProcessFieldDoc };
  fieldsOrder: string[];
  phasesRemoved: string[];
  members: MemberDoc[];
  updated: number;
  /** FileId, valid object id */
  coverImage?: string;
  /** Custom label text for activity name */
  createNewLabel?: string;
  enableAddedField: boolean;
  /** Enables receiving linked announcements when activities linking to activities in this workflow are created or moved */
  enableLinkedAnnouncements?: boolean;
  enableMapLocation?: boolean;
  /** Determines if a workflow is an dataset. */
  enableUnlinkedMode?: boolean;
  enableMessenger?: boolean;
  allowGuests?: boolean;
  enableGuestEditing?: boolean;
  enableModifiedField?: boolean;
  enableOwnerField?: boolean;
  enableOwnerTeamField?: boolean;
  ownerTeamFieldTitle?: string;
  enableUniqueName?: boolean;
  enablePredefinedName?: boolean;
  enablePreselectedTeam?: boolean;
  /** Used as title for feed post announcements generated for new activities */
  initPhaseDescription?: string;
  locationRequired?: boolean;
  /** Custom label for activity name column */
  nameColumnText?: string;
  /** Javascript code for generating activity name */
  nameFunction?: string;
  /** Enable activity name to be generated by the code given in `nameFunction` */
  nameFunctionEnabled?: boolean;
  nameFunctionVariables?: FunctionDependencies;
  nameEditable?: boolean;
  /** UserId, valid object id */
  personInCharge?: string;
  /** Custom title / label for person in charge */
  personInChargeLabel?: string;
  publicForm?: {
    /** unique key for public form, used to access via url */
    key: string;
    active: boolean;
    /** Creator Uid */
    creator: string;
    team_account: TeamAccount;
    /** Single follower uid contrary to the field name */
    followers: string;
    /** If true, show activitylink fields and allow search activities  */
    allowRead: boolean;
    /** If true, enables form messaging endpoints  */
    enableMessaging?: boolean;
    theme?: {
      foregroundColor: string;
      backgroundColor: string;
      complementaryColor: string;
      textColor: string;
      logoId: string | null;
      headerColor: string;
    };
  };
  predefinedNamePrefix?: string;
  preselectedTeam?: TeamAccount;
  enableAttachments: boolean;
  /** Custom placeholder text for activity name field */
  nameFieldPlaceHolderText: string;
  // Correct type is ProcessPhaseDoc (check backend types in hailer-api)
  phases: { [phase_id: string]: unknown };
  phasesOrder: string[];
  order?: number;
  allowMultipleTags?: boolean;
  allowCustomTags?: boolean;
  requireFileTag?: boolean;
  documentTemplates?: DocumentTemplate[];
  color?: string;
  starred?: string[];
  // Correct type is PermitKeys[] (check backend types in hailer-api)
  discussionPermissions?: unknown[];
  isStarred?: boolean;
  inviteActivityCreator?: boolean;
  key?: string;

  /** Used for sequencing activities in a process */
  createdActivities?: number;
  /** To know what is installed via market place */
  workflowSuite?: {
    productId: string;
    name: string;
    packageHash: string;
    created: number;
  };
  groupNames?: string[];
  enableActivityTagging?: boolean;
  activityTaggingPhaseIds?: string[];
} & Syncable;

type FieldMap = {
  staticActivityIds: string;
  images: {
    [key: string]: Image;
  };
  activityLinks: {
    [key: string]: LinkedField;
  };
  fields: {
    [key: string]: Field;
  };
  // eslint-disable-next-line ts/no-explicit-any
  itemTable: any;
  hailerFooterImage: string;
};

type RenderedActivity = {
  id: string;
  label: string;
  type: string;
  unit: string | undefined;
  // eslint-disable-next-line ts/no-explicit-any
  value: any;
  // eslint-disable-next-line ts/no-explicit-any
  data?: any;
  processId: string;
  activityId: string;
  modifier?: {
    checkbox: boolean;
    file: boolean;
  };
};

type Field = {
  label: string;
  value: string;
  description: string;
};

type LinkedField = {
  label: string;
  process: string;
  field: string;
  description: string;
};

type Image = {
  value: string;
  description: string;
};

type ActivityEventName = "phase.activity-created" | "phase.activity-updated" | "phase.activity-moved";

type WorkspaceEventName = "workspace.member-joined" | "workspace.member-left";

type ScheduleEventName = "schedule.run";

type ActionEvent = "manual" | ActivityEventName | WorkspaceEventName | ScheduleEventName;

/**
 * A trigger key: the event name followed by its parameters, joined with ":".
 * - `phase.activity-created:<workflowId>:<phaseId>` (same for -updated / -moved)
 * - `workspace.member-joined` / `workspace.member-left` (no parameters)
 * `manual` and `schedule.run` are run events, never trigger keys; the schedule lives in `schedule`.
 */
type HailerActionTriggerKey = string;

/** The schedule as clients send it (create/update). */
type HailerActionScheduleInput = {
  /** 5-field cron expression (minute hour day-of-month month day-of-week). */
  cron: string;
  /** IANA timezone the expression is read in (e.g. "Europe/Helsinki", "UTC"); UTC when absent. */
  tz?: string;
};

/** The schedule as the API stores and returns it. */
type HailerActionSchedule = HailerActionScheduleInput & {
  /** Next firing, ms since epoch — written by hailer-api, never accepted from clients. */
  nextRunAt?: number;
};

type HailerAction = {
  _id: string;
  /** Workspace scope. The API maps the internal `cid` to `workspaceId` in every response. */
  workspaceId: string;
  name: string;
  /** Optional fields may be null: the list schema allows it, and null clears them on update. */
  description?: string | null;
  /** Disabled actions refuse to run (any trigger). */
  enabled: boolean;
  /** TypeScript/JavaScript source; must export an execute(input) function. */
  code: string;
  /** Verbatim package.json content declaring the code's npm dependencies. */
  packageJson?: string | null;
  /** Hosts the run may reach (hailer-exec --allow-net values). Default: none. */
  allowNet?: string[] | null;
  /**
   * Workspace credentials injected into the run as env vars. Each credential's
   * decrypted payload keys become env var names (values stringified as-is,
   * non-strings as JSON). Later credentials in the array win key collisions.
   */
  credentialIds: string[];
  /** Per-run resource caps, clamped by hailer-exec's own maxima. */
  limits?: {
    /**
     * Wall-clock budget for one run in ms (excludes dependency install);
     * crossing it kills the run → status 'timeout'.
     */
    wallTimeMs?: number;
  } | null;
  /**
   * Event-triggered runs allowed in a sliding hour (manual and test runs don't
   * count). Bounds self-firing loops. Unset → the built-in default.
   */
  maxRunsPerHour?: number | null;
  /** Event trigger keys the action is bound to (at most 32, unique). */
  triggers: HailerActionTriggerKey[];
  /** Cron schedule firing `schedule.run`; present means active. */
  schedule?: HailerActionSchedule;
  createdBy: string;
  created: number;
  updated: number;
};

type HailerActionImmutableFields
  = | "_id"
    | "workspaceId"
    | "created"
    | "createdBy"
    | "updated";

/** Body of v3.action.create (the client adds workspaceId). */
type HailerActionCreatePayload
  = Omit<HailerAction, HailerActionImmutableFields | "triggers" | "schedule"> & {
    triggers?: HailerActionTriggerKey[];
    schedule?: HailerActionScheduleInput;
  };

/**
 * Body of v3.action.update: every field optional, at least one key required.
 * `null` clears an optional field; `triggers` always replaces the whole list,
 * `schedule` replaces the schedule and restarts it from now.
 */
type HailerActionUpdatePayload
  = Partial<Omit<HailerAction, HailerActionImmutableFields | "schedule">> & {
    schedule?: HailerActionScheduleInput | null;
  };

/** A normalized action: what pull writes locally and what push hashes on both sides. */
type HailerActionPayload
  = Omit<HailerAction, HailerActionImmutableFields | "schedule"> & {
    _id?: string;
    schedule?: HailerActionScheduleInput;
  };

/** What `action.config.ts` exports: the payload without the two parts that live in their own files (action.code.ts, package.json). */
type HailerActionConfig = Omit<HailerActionPayload, "code" | "packageJson">;

type HailerActionRunStatus
  = | "queued"
    | "running"
    | "completed"
    | "runtime_error"
    | "timeout"
    | "output_limit"
    | "infra_error"
    | "cancelled"
    | "config_error"
    | "denied";

/** A run record as returned by v3.action.trigger and v3.action.run. */
type HailerActionRun = {
  _id: string;
  actionId?: string;
  workspaceId: string;
  event: ActionEvent;
  test?: true;
  /** The user whose action caused the run; absent on a headless run (schedule). */
  triggeredBy?: string;
  /** test: the inline config that was executed. */
  config?: HailerActionRunPayload["config"];
  /** JSON of the input execute(input) was called with; absent when it exceeded the size limit. */
  arguments?: string;
  status: HailerActionRunStatus;
  execRunId?: string | null;
  exitCode?: number | null;
  stdout?: string | null;
  stderr?: string | null;
  output?: unknown;
  message?: string | null;
  wallTimeMs?: number | null;
  created: number;
  finishedAt?: number | null;
};

/**
 * Body of v3.action.run: executes `config` inline without saving it (the editor's test button).
 * At most one of `input`, `activityId`, `member` may be given; `actionId` links the test run to a saved action.
 */
type HailerActionRunPayload = {
  workspaceId: string;
  config: {
    name?: string;
    code: string;
    packageJson?: string;
    allowNet?: string[];
    credentialIds?: string[];
    limits?: { wallTimeMs?: number };
  };
  actionId?: string;
  /** Delivered as the payload of a "manual" event. */
  input?: unknown;
  /** Delivered exactly as a phase trigger delivers it on creation (event "phase.activity-created"). */
  activityId?: string;
  /** Delivered exactly as a membership trigger delivers a member ("workspace.member-joined" / "workspace.member-left"). */
  member?: { userId: string; event: "joined" | "left" };
};

/** One row of the `actions.ts` registry. Leave `_id` empty for a new action and run `ws-config actions sync`. */
type HailerActionEntry = {
  _id?: string;
  name: string;
  /** Folder under workspace/actions/ holding action.config.ts, action.code.ts and package.json. Auto-generated on pull. */
  folder?: string;
};

type CredentialType = "basic" | "apiKey" | "custom";

type HailerCredential = {
  _id: string;
  name: string;
  type: CredentialType;
  workspaceId?: string;
  appId?: string;
  readers?: string[];
  createdBy: string;
  created: number;
  updated: number;
};
