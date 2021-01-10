import win32gui
import pywintypes
import pyautogui as pg
from pathlib import Path

from .config import Config


class Window(object):

    def __init__(self):
        return

    def set_window_active(self):
        name = Config.read('window.name')
        h = win32gui.FindWindow(None, name)
        win32gui.BringWindowToTop(h)
        try:
            win32gui.SetForegroundWindow(h)
        except:
            import traceback
            traceback.print_exc()

        self.rect = win32gui.GetWindowRect(h)

    def click_pos(self, x: int, y: int):
        pg.moveTo(self.rect[0] + x, self.rect[1] + y)
        pg.click()

    def click(self, *args: tuple):
        pos = Config.read('positions', *args)
        self.click_pos(pos[0], pos[1])

    def get_sample(self, path: str):
        return pg.screenshot(region=self.get_region(path))

    def get_region(self, path: str):
        target = Config.read("samples." + path)
        return (
            target[0] + self.rect[0],
            target[1] + self.rect[1],
            target[2],
            target[3]
        )

    def save_sample(self, path: str):
        img = self.get_sample(path)
        img.save(self.get_sample_image_path(path))

    def get_sample_image_path(self, path: str) -> Path:
        dir = Path(Config.read("path.samples"))
        dir.mkdir(parents=True, exist_ok=True)
        all = dir / (path + '.png')
        return all

    def check(self, path):
        filename = str(self.get_sample_image_path(path))
        region = self.get_region(path)

        try:
            pos = pg.locateOnScreen(filename, region=region)
        except:
            return False

        return (pos is not None)
