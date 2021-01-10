import json


class Config:
    data = None
    path = "config.json"

    @classmethod
    def load(cls) -> dict:
        with open(cls.path, encoding="utf-8") as file:
            cls.data = json.load(file)
        return cls.data

    @classmethod
    def read(cls, *args: tuple):
        if len(args) == 0:
            return cls.load()

        def split(args):
            res = ()
            for a in args:
                if type(a) is tuple:
                    res = res + a
                else:
                    res = res + tuple(str(a).split('.'))
            return res

        args = split(args)

        def get(cnf, path):
            if isinstance(cnf, dict):
                return cnf.get(path)
            if isinstance(cnf, list):
                return cnf[int(path)]

        if len(args) == 1:
            return get(cls.load(), args[0])

        return get(cls.read(*args[:-1]), args[-1])
