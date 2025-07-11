/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Add daily cron job to reset dailyExperience at midnight
  app.cron().add('reset_daily_experience', '0 0 * * *', () => {
    // Get all users
    const users = $app.dao().findRecordsByFilter('users', '');
    
    // Update each user's daily experience to zero
    users.forEach(user => {
      $app.dao().saveRecord($app.dao().findRecordById('users', user.id, {
        dailyExperience: 0
      }));
    });
    
    console.log('Daily experience reset completed for all users');
  });
  
  // Add weekly cron job to reset weeklyExperience at midnight on Sunday (day 0)
  app.cron().add('reset_weekly_experience', '0 0 * * 0', () => {
    // Get all users
    const users = $app.dao().findRecordsByFilter('users', '');
    
    // Update each user's weekly experience to zero
    users.forEach(user => {
      $app.dao().saveRecord($app.dao().findRecordById('users', user.id, {
        weeklyExperience: 0
      }));
    });
    
    console.log('Weekly experience reset completed for all users');
  });
}, (app) => {
  // Revert the changes
  app.cron().remove('reset_daily_experience');
  app.cron().remove('reset_weekly_experience');
});