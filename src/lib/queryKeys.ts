/**
 * Centralized React Query keys
 * Makes it easier to invalidate queries and maintain consistency
 */

export const queryKeys = {
  // User queries
  user: {
    profile: ["user-profile"] as const,
  },

  // Users management queries
  users: {
    all: ["users"] as const,
    detail: (id: string) => ["users", id] as const,
    sessions: (id: string) => ["users", id, "sessions"] as const,
  },

  // Roles queries
  roles: {
    all: ["roles"] as const,
    detail: (id: string) => ["roles", id] as const,
  },

  // Permissions queries
  permissions: {
    all: ["permissions"] as const,
  },

  // Categories queries
  categories: {
    all: ["categories"] as const,
    detail: (id: string) => ["categories", id] as const,
  },

  // Courses queries
  courses: {
    all: ["courses"] as const,
    detail: (id: string) => ["courses", id] as const,
    myCourses: ["my-courses"] as const,
    myEnrollments: ["my-enrollments"] as const,
  },

  // Contacts queries
  contacts: {
    all: ["contacts"] as const,
    detail: (id: string) => ["contacts", id] as const,
  },

  // Reviews queries
  reviews: {
    all: ["reviews"] as const,
    detail: (id: string) => ["reviews", id] as const,
  },

  // Resources queries
  resources: {
    all: ["resources"] as const,
    detail: (id: string) => ["resources", id] as const,
    public: ["public-resources"] as const,
    publicDetail: (slug: string) => ["public-resources", slug] as const,
    publicPost: (slug: string) => ["public-posts", slug] as const,
  },
};
