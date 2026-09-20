import sys
import os

# Add the current directory to sys.path so we can import 'api'
sys.path.append(os.getcwd())

try:
    from api.index import app
    print("Successfully imported app from api.index")
    print("Registered Routes:")
    for rule in app.url_map.iter_rules():
        print(f"Endpoint: {rule.endpoint}, Methods: {rule.methods}, Rule: {rule.rule}")
except Exception as e:
    import traceback
    print("Failed to import app from api.index")
    traceback.print_exc()
