import re
import subprocess
import sys

def get_last_command_output(clean_log_path='/Users/sanjanathyady/Desktop/AiBB/Backend/RAG/logs/cleaned-session.log'):
    try:
        clean_script = "/Users/sanjanathyady/Desktop/AiBB/Backend/RAG/logs/clean.py"

        subprocess.run([sys.executable, clean_script], check=True)
        with open(clean_log_path, 'r') as f:
            lines = f.readlines()
    except FileNotFoundError:
        return {"cmd": None, "output": None, "error": "Log file not found."}

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
        return {
            "cmd": last['cmd'],
            "output": "\n".join(last['output'])
        }
    else:
        return {"cmd": None, "output": None, "error": "No command found."}

