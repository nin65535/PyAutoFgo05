import eel
from .stage import Stage
from .window import Window
from .player import Player


class App:
    _instance = None

    @classmethod
    def init(cls):
        if cls._instance is None:
            cls._instance = App()

    def __init__(self):
        self.stage = Stage()
        self.window = Window()
        self.player = Player(self)

    @staticmethod
    @eel.expose
    def get_stages() -> list:
        App._instance.log('get_stage called')
        return App._instance.stage.stages

    @staticmethod
    @eel.expose
    def update_stages() -> None:
        return App._instance.stage.read_all()

    @staticmethod
    @eel.expose
    def play(stage: int, command: int) -> None:
        App._instance.window.set_window_active()
        App._instance.player.play(stage, command)

    @staticmethod
    @eel.expose
    def stop() -> None:
        App._instance.player.stop()

    def set_pos(self, stage_no: int, cmd_no: int, line_no: int) -> None:
        if hasattr(eel, 'set_pos'):
            eel.set_pos(stage_no, cmd_no, line_no)  # pylint: disable=no-member
        else:
            pass

    def log(self, msg: str) -> None:
        if hasattr(eel, 'log'):
            eel.log(msg)  # pylint: disable=no-member
        else:
            print(msg)

    def play_end(self, stage_no: int, cmd_no: int) -> None:
        if hasattr(eel, 'play_end'):
            eel.play_end(stage_no, cmd_no)  # pylint: disable=no-member
        else:
            print('play_end not found')

