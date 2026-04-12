
import sys

def check_jsx_balance(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    for i, line in enumerate(lines):
        line_num = i + 1
        # Very crude check
        if '<motion.div' in line:
            if '/>' not in line: # if not self closing
                 stack.append(('motion.div', line_num))
        if '</motion.div>' in line:
            if stack:
                stack.pop()
            else:
                print(f"Extra closing tag </motion.div> on line {line_num}")
    
    for tag, line_num in stack:
        print(f"Unclosed {tag} from line {line_num}")

check_jsx_balance(r"c:\Users\m\OneDrive\Desktop\graduatedproject\ai-edu-platform\src\pages\HomePage.jsx")
