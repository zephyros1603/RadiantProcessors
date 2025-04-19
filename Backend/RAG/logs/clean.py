# clean_log.py
import re

def clean_log_file(input_file='/Users/sanjanathyady/Desktop/kali-logs/live-session.log', output_file='cleaned-session.log'):
    with open(input_file, 'r', errors='ignore') as f:
        raw = f.read()

    # Remove ANSI escape codes and control sequences
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    cleaned = ansi_escape.sub('', raw)

    # Remove weird control characters (e.g., ^[)
    cleaned = re.sub(r'\x1b\[[0-9;]*[a-zA-Z]', '', cleaned)
    cleaned = re.sub(r'[^\x20-\x7E\r\n]', '', cleaned)

    with open(output_file, 'w') as f:
        f.write(cleaned)

    print(f"[✓] Cleaned log saved to {output_file}")

if __name__ == "__main__":
    clean_log_file()