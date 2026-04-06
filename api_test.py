import requests
import os
import json

api_key = "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"
base_url = "https://openrouter.ai/api/v1"

def test_openai_format():
    print("Testing OpenAI-compatible endpoint...")
    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "openrouter/free",
        "messages": [{"role": "user", "content": "hi"}]
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

def test_anthropic_format():
    print("\nTesting Anthropic-compatible endpoint...")
    # Claude Code uses the Anthropic SDK, which hits /messages usually
    url = f"{base_url}/messages"
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    data = {
        "model": "openrouter/free",
        "messages": [{"role": "user", "content": "hi"}],
        "max_tokens": 10
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text[:200]}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_openai_format()
    test_anthropic_format()
