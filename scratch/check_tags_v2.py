import re

def check_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    tags_to_check = ['div', 'motion.div', 'section', 'AnimatePresence', 'span']
    
    for tag in tags_to_check:
        open_pattern = rf'<{tag}(?:\s+[^/>]*)?>'
        close_pattern = rf'</{tag}>'
        self_close_pattern = rf'<{tag}(?:\s+[^/>]*)?/>'
        
        # We need a more careful parser to handle the stack
        stack = []
        lines = content.splitlines()
        
        for line_no, line in enumerate(lines, 1):
            # Find all open, close, and self-close tags in this line
            # This is still a bit naive about strings/comments
            events = []
            for m in re.finditer(open_pattern, line):
                # Check if it's a self-closer
                if not m.group(0).endswith('/>'):
                    events.append((m.start(), 'open', line_no))
            for m in re.finditer(close_pattern, line):
                events.append((m.start(), 'close', line_no))
            
            events.sort()
            
            for pos, type, ln in events:
                if type == 'open':
                    stack.append((tag, ln))
                else:
                    if stack and stack[-1][0] == tag:
                        stack.pop()
                    else:
                        print(f"Error: Found </{tag}> on line {ln} without matching opener")
        
        if stack:
            print(f"Error: {len(stack)} <{tag}> tags never closed. Opened on lines: {[item[1] for item in stack]}")
        else:
            print(f"Success: {tag} tags are balanced.")

check_tags(r'c:\Users\m\OneDrive\Desktop\graduatedproject\ai-edu-platform\src\pages\HomePage.jsx')
