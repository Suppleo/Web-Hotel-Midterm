export const isAuthenticated = (next) => (parent, args, context, info) => {
    if (!context.user) {
      throw new Error('You must be logged in to perform this action');
    }
    
    return next(parent, args, context, info);
  };
  
  export const hasRole = (role) => (next) => (parent, args, context, info) => {
    if (!context.user) {
      throw new Error('You must be logged in to perform this action');
    }
    
    if (context.user.role !== role && context.user.role !== 'admin') {
      throw new Error(`You must have ${role} role to perform this action`);
    }
    
    return next(parent, args, context, info);
  };
  