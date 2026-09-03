export async function install(context) {
  console.log('Installing Demo Counter extension...');
  
  try {
    // Initialize counter in database
    const initialValue = context.config?.startValue || 0;
    
    await context.database.query(
      `CREATE TABLE IF NOT EXISTS demo_counter_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        value INTEGER NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    );
    
    // Log installation
    await context.database.query(
      `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
      ['install', initialValue]
    );
    
    console.log('Demo Counter installed successfully');
    return { success: true, message: 'Demo Counter extension installed' };
  } catch (error) {
    console.error('Installation failed:', error);
    throw error;
  }
}

export async function enable(context) {
  console.log('Enabling Demo Counter extension...');
  try {
    const result = await context.database.query(
      `SELECT COUNT(*) as count FROM demo_counter_log`
    );
    console.log(`Demo Counter enabled. Log entries: ${result[0].count}`);
    return { success: true };
  } catch (error) {
    console.error('Enable failed:', error);
    throw error;
  }
}

export async function disable(context) {
  console.log('Disabling Demo Counter extension...');
  try {
    await context.database.query(
      `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
      ['disable', 0]
    );
    console.log('Demo Counter disabled');
    return { success: true };
  } catch (error) {
    console.error('Disable failed:', error);
    throw error;
  }
}

export async function update(fromVersion, toVersion, context) {
  console.log(`Updating Demo Counter from ${fromVersion} to ${toVersion}...`);
  try {
    await context.database.query(
      `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
      [`update_${fromVersion}_to_${toVersion}`, 0]
    );
    console.log('Demo Counter updated');
    return { success: true };
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
}

export async function uninstall(context, purgeData) {
  console.log(`Uninstalling Demo Counter (purgeData: ${purgeData})...`);
  try {
    if (purgeData) {
      await context.database.query(`DROP TABLE IF EXISTS demo_counter_log`);
      console.log('Demo Counter data purged');
    } else {
      await context.database.query(
        `INSERT INTO demo_counter_log (action, value) VALUES (?, ?)`,
        ['uninstall', 0]
      );
    }
    return { success: true };
  } catch (error) {
    console.error('Uninstall failed:', error);
    throw error;
  }
}
