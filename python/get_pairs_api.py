import requests
import json
import sys # Import sys module to access command-line arguments

def get_pairs_by_address(address: str, chain_id: int = 8453) -> dict:
    if not address:
        return {"error": "Address cannot be empty."}

    url = f"https://api.honeypot.is/v1/GetPairs?address={address}&chainID={chain_id}"

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
    # Get address from command-line arguments
    # sys.argv[0] is the script name itself
    # sys.argv[1] will be the first argument (address)
    # sys.argv[2] will be the second argument (chainId)
    address_from_node = sys.argv[1] if len(sys.argv) > 1 else ""
    chain_id_from_node = int(sys.argv[2]) if len(sys.argv) > 2 else 8453 # Convert to int

    # Call your function with the arguments received from Node.js
    result = get_pairs_by_address(address_from_node, chain_id_from_node)

    # Print the result as a JSON string to stdout
    # This is what the Node.js process will capture
    print(json.dumps(result)) # No indent needed for programmatic consumption