# Demo Counter Extension

A sample Blueprint extension to demonstrate the serverless key function and extension lifecycle management.

## Features

- **Counter Management**: Increment, decrement, and reset counter values
- **Activity Logging**: Track all counter changes with timestamps
- **Configuration**: Customize start value, step size, and max value
- **Real-time Updates**: Auto-refresh counter state every 5 seconds
- **Lifecycle Hooks**: Full install/enable/disable/update/uninstall implementation

## Installation

1. Get the extension key from BluePrint Registry
2. Install via JTG Panel admin dashboard
3. Configure settings as needed

## API Endpoints

- `GET /api/extensions/demo-counter/state` - Get current counter state
- `POST /api/extensions/demo-counter/increment` - Increment counter
- `POST /api/extensions/demo-counter/decrement` - Decrement counter
- `POST /api/extensions/demo-counter/reset` - Reset counter
- `GET /api/extensions/demo-counter/log` - Get activity log

## Configuration Options

- **Start Value**: Initial counter value (default: 0)
- **Increment Step**: How much to change per action (default: 1)
- **Max Value**: Maximum allowed counter value (default: 1000)
- **Enable Logging**: Track counter changes (default: true)

## Development

```bash
npm install
npm run dev
npm run build
```

## License

MIT
