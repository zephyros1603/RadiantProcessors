# get_last_command_output.py
def get_last_command_output(clean_log_path='cleaned-session.log'):
    with open(clean_log_path, 'r') as f:
        lines = f.readlines()

    commands = []
    current = {"cmd": "", "output": []}

    for line in lines:
        if line.strip().startswith('# '):  # User command
            if current["cmd"]:
                commands.append(current)
                current = {"cmd": "", "output": []}
            current["cmd"] = line.strip()[2:]
        elif current["cmd"]:  # Collect output
            current["output"].append(line.rstrip())

    if current["cmd"]:
        commands.append(current)

    if commands:
        last = commands[-1]
        print(f"🧠 Last command:\n> {last['cmd']}")
        print("\n📤 Output:")
        print("\n".join(last['output']))
        return last
    else:
        print("No command found.")
        return None

if __name__ == "__main__":
    get_last_command_output()
    