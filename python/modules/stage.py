import json
from pathlib import Path
from .config import Config

class Stage:
    def __init__(self):
        self.read_all()

    def read_all(self):
        path = Path(Config.read('path.stages'))
        self.stages = [type(self).read(file) for file in path.glob('*.json')]
 
    @classmethod
    def read(cls, path: Path):
        with open(path, encoding="utf-8") as file:
            data = json.load(file)
        return data
