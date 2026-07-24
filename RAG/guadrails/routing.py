from chat import State

def route_after_input(
    state: State
):

    if state.get(
        "input_blocked",
        False
    ):

        return "blocked"

    return "continue"
