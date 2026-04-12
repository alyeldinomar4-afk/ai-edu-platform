
import re

def check_balance(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    # Simplified tag regex (doesn't handle all JSX but good for common ones)
    tag_re = re.compile(r'<(/?)([a-zA-Z0-9\.]+)([^>]*?)(/?)>')
    
    for i, line in enumerate(lines):
        line_num = i + 1
        for match in tag_re.finditer(line):
            is_closing = match.group(1) == '/'
            tag_name = match.group(2)
            is_self_closing = match.group(4) == '/'
            
            if is_self_closing:
                continue
            
            if is_closing:
                if not stack:
                    print(f"ERROR: Extra closing tag </{tag_name}> on line {line_num}")
                else:
                    last_tag, last_line = stack.pop()
                    if last_tag != tag_name:
                        print(f"ERROR: Mismatched tag on line {line_num}. Found </{tag_name}>, expected </{last_tag}> (from line {last_line})")
            else:
                stack.append((tag_name, line_num))
    
    for tag_name, line_num in stack:
        print(f"ERROR: Unclosed tag <{tag_name}> on line {line_num}")

check_balance(r"c:\Users\m\OneDrive\Desktop\graduatedproject\ai-edu-platform\src\pages\HomePage.jsx")
