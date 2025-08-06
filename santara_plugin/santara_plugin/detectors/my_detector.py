from slither.detectors.abstract_detector import AbstractDetector, DetectorClassification

class MyDetector(AbstractDetector):
    ARGUMENT = 'mydetector'
    HELP = 'Detects custom pattern (example)'
    IMPACT = DetectorClassification.INFORMATIONAL
    CONFIDENCE = DetectorClassification.HIGH

    WIKI = ''
    WIKI_TITLE = 'MyDetector Example'
    WIKI_DESCRIPTION = 'A simple Slither plugin detector.'
    WIKI_EXPLOIT_SCENARIO = ''
    WIKI_RECOMMENDATION = ''

    def _detect(self):
        info = ['Custom detector ran successfully.']
        res = self.generate_result(info)
        return [res]
