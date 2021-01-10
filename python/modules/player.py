import re
import weakref
import time
import eel
from .config import Config


class PlayingStopException(Exception):
    pass


class Player:

    def __init__(self, app):
        self._app = weakref.ref(app)
        self.click = app.window.click
        self.sleep = eel.sleep
        self.sleep_step = Config.read('player.sleep_step')
        self.stop_flg = False
        self.log = app.log

    @property
    def app(self):
        return self._app()

    def wait_for(self, sample: str = 'attack.0'):
        while not self.app.window.check(sample):
            if(self.stop_flg):
                raise PlayingStopException()

            self.sleep(self.sleep_step)
        return

    def skill(self, skill_no: int, target: str = '', target_wait: float = 0.5):
        self.wait_for()
        self.click('skill.{:d}'.format(skill_no))

        if len(target):
            self.sleep(target_wait)
            self.click(target)
        self.sleep(1)
        self.wait_for()
        return

    def stop(self):
        self.stop_flg = True

    def play(self, stage_no: int = 0, cmd_no: int = 0):
        self.log('{:02d}-{:02d} :play start'.format(stage_no, cmd_no))
        self.stop_flg = False

        session = PlaySession(self, stage_no, cmd_no, 0)

        try:
            for pos in session:
                self.app.set_pos(
                    pos['stage_no'], pos['cmd_no'], pos['line_no'])
                log = '{stage_no:02d}-{cmd_no:02d}-{line_no:02d}:{cmd:s}'.format(
                    **pos)
                self.app.log(log)
                self.step(pos["cmd"])

                self.sleep(0)  # 別スレッドを走らせることでstopの割り込みを受け入れる

                if self.stop_flg:
                    raise PlayingStopException()

        except PlayingStopException:
            self.log('{:02d}-{:02d} :play stop'.format(stage_no, cmd_no))

        self.log('{:02d}-{:02d} :play end'.format(stage_no, cmd_no))
        self.app.play_end(stage_no, cmd_no)
        return

    def get_cmd(self,  stage_no: int = 0, cmd_no: int = 0, line_no: int = 0):
        return self.app.stage.stages[stage_no]['commands'][cmd_no][line_no]

    def step(self, cmd):
        if (cmd[0] == "#"):
            self.log('control command:{}'.format(cmd))
        else:
            eval('self.' + cmd)

    def master_skill(self, i):
        self.wait_for()
        self.click('master_skill.3')
        self.sleep(0.2)
        self.click('master_skill', i)
        self.sleep(0.2)

    def swap(self, i, j):
        self.master_skill(2)
        self.click('swap', i)
        self.click('swap', j)
        self.click('swap.6')
        self.sleep(5)

    def attack(self, *args: tuple):
        self.wait_for()
        self.click('attack.0')
        self.sleep(2)
        for arg in args:
            self.select_card(arg)

    def select_card(self, arg: str):
        if arg[0] == 'N':
            self.click('noble_phantasm', arg[1])

        if arg[0] == 'C':
            self.click('card', arg[1])


class PlaySession:
    is_goto = re.compile(r'#goto (\d+)')
    is_call = re.compile(r'#call (\d+)')

    # 進行管理用オブジェクト
    def __init__(self, player, stage_no: int, cmd_no: int, line_no: int):
        self._player: Player = weakref.ref(player)
        self.stage_no: int = stage_no
        self.cmd_no: int = cmd_no
        self.line_no: int = line_no
        self.call_stack = []

    @property
    def position(self):
        return {
            'stage_no': self.stage_no,
            'cmd_no': self.cmd_no,
            'line_no':  self.line_no,
        }

    @position.setter
    def position(self, pos):
        self.stage_no = pos['stage_no']
        self.cmd_no = pos['cmd_no']
        self.line_no = pos['line_no']

    @property
    def player(self):
        return self._player()

    @property
    def app(self):
        return self.player.app

    def __iter__(self):
        return self

    def __next__(self):
        while True:
            try:
                cmd = self.player.get_cmd(
                    self.stage_no, self.cmd_no, self.line_no)
                break
            except IndexError:
                if(len(self.call_stack) == 0):
                    raise StopIteration()

                pos = self.call_stack.pop()
                self.position = pos

        value = {
            'stage_no': self.stage_no,
            'cmd_no': self.cmd_no,
            'line_no': self.line_no,
            'cmd': cmd
        }

        if(type(self).is_goto.match(cmd)):
            self.cmd_no = int(type(self).is_goto.findall(cmd)[0])
            self.line_no = 0
        elif(type(self).is_call.match(cmd)):
            self.line_no += 1
            self.call_stack.append(self.position)

            self.cmd_no = int(type(self).is_call.findall(cmd)[0])
            self.line_no = 0
        else:
            self.line_no += 1

        return value
