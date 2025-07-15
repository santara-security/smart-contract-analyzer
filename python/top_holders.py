import requests
import json
import sys

def get_top_holders(address: str, chain_id: int = 8453) -> dict:
    if not address:
        return {"error": "Address cannot be empty."}

    url = f"https://api.honeypot.is/v1/TopHolders?address={address}&chainID={chain_id}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        return {"error": f"HTTP error occurred: {http_err}", "response_text": response.text}
    except requests.exceptions.ConnectionError as conn_err:
        return {"error": f"Connection error occurred: {conn_err}"}
    except requests.exceptions.Timeout as timeout_err:
        return {"error": f"Timeout error occurred: {timeout_err}"}
    except requests.exceptions.RequestException as req_err:
        return {"error": f"An unexpected error occurred: {req_err}"}
    except json.JSONDecodeError as json_err:
        return {"error": f"JSON decode error occurred: {json_err}", "response_text": response.text}


if __name__ == "__main__":
    address = sys.argv[1] if len(sys.argv) > 1 else ""
    chain_id = int(sys.argv[2]) if len(sys.argv) > 2 else 8453

    result = get_top_holders(address, chain_id)
    print(json.dumps(result))
