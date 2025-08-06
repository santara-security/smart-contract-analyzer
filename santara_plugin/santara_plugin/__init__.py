
from .detectors.my_detector import MyDetector
from .detectors.swc_103_106_detector import SWC103106Detector

def make_plugin():
    return [MyDetector, SWC103106Detector], []
