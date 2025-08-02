from slither.detectors.abstract_detector import AbstractDetector, DetectorClassification
import re

class SWC103106Detector(AbstractDetector):
    ARGUMENT = 'swc103106'
    HELP = 'Detects SWC-103 (Floating Pragma) and SWC-106 (Unprotected SELFDESTRUCT) patterns.'
    IMPACT = DetectorClassification.MEDIUM
    CONFIDENCE = DetectorClassification.HIGH

    WIKI = ''
    WIKI_TITLE = 'SWC-103 and SWC-106 Detector'
    WIKI_DESCRIPTION = 'Detects floating pragma statements and unprotected selfdestruct/suicide instructions.'
    WIKI_EXPLOIT_SCENARIO = ''
    WIKI_RECOMMENDATION = ''

    def _detect(self):
        results = []
        for contract in self.compilation_unit.contracts_derived:
            source_code = contract.source_code
            # SWC-103: Floating pragma detection
            pragma_matches = re.findall(r'pragma solidity\s*([\^~><=]*[\d\.*]+)', source_code)
            for pragma in pragma_matches:
                if any(x in pragma for x in ['^', '>', '<', '*', '~']) or 'pragma solidity' in source_code and not re.search(r'pragma solidity\s*=?\s*\d+\.\d+\.\d+;', source_code):
                    info = [f"SWC-103: Floating pragma detected in contract {contract.name}", contract]
                    results.append(self.generate_result(info))
            # SWC-106: Unprotected selfdestruct/suicide detection
            for function in contract.functions:
                function_code = function.source_code
                if function_code:
                    if re.search(r'selfdestruct\s*\(', function_code) or re.search(r'suicide\s*\(', function_code):
                        # Check for access control (very basic: look for onlyOwner or similar)
                        if not re.search(r'onlyOwner|onlyAdmin|require\s*\(', function_code):
                            info = [f"SWC-106: Unprotected selfdestruct/suicide detected in function {function.name} of contract {contract.name}", function]
                            results.append(self.generate_result(info))
        return results
