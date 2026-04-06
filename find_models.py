import json

try:
    with open('models_utf8.json', 'r', encoding='utf-8-sig') as f:
        data = json.load(f)
        for model in data.get('data', []):
            mid = model.get('id', '').lower()
            if 'stepfun' in mid or 'step-3' in mid:
                print(f"ID: {model['id']}, Name: {model.get('name', 'N/A')}")
except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
