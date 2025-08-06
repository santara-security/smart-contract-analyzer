# Santara Slither Plugin

This is a template for a Slither plugin. It includes a simple detector example.

## How to install and test

1. Navigate to the plugin directory:
   ```bash
   cd santara_plugin
   ```
2. Install the plugin in development mode:
   ```bash
   pip install -e .
   ```
3. Run Slither with your plugin:
   ```bash
   slither path/to/contract.sol --detect mydetector
   ```

You should see output from the custom detector.
