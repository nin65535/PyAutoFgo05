import eel
from python.modules.app import App
from python.modules.config import Config

def start_gui():
    App.init()
    eel.init('public')
    eel.start('index.html', size=(400, 1800), position=(0,0))

if __name__ == '__main__':
    start_gui()
