import re

def check_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all opening and closing tags for common elements
    tags_to_check = ['div', 'motion.div', 'section', 'AnimatePresence', 'span']
    
    for tag in tags_to_check:
        # Regex for opening tags: <tag ... > (excluding self-closing)
        open_pattern = rf'<{tag}(?:\s+[^/>]*)?>'
        # Regex for closing tags: </tag>
        close_pattern = rf'</{tag}>'
        
        opens = list(re.finditer(open_pattern, content))
        closes = list(re.finditer(close_pattern, content))
        
        print(f"Tag: {tag}")
        print(f"  Opens: {len(opens)}")
        print(f"  Closes: {len(closes)}")
        print(f"  Balance: {len(opens) - len(closes)}")
        
        if len(opens) != len(closes):
            print("  --- Mismatches (First few) ---")
            # Simple stack-based tracker to find where it goes wrong
            stack = []
            lines = content.splitlines()
            for line_no, line in enumerate(lines, 1):
                # This is a very simplified parser, doesn't handle strings correctly
                line_opens = re.finditer(open_pattern, line)
                line_closes = re.finditer(close_pattern, line)
                
                # Combine and sort by position in line
                events = []
                for m in line_opens: events.append((m.start(), 'open'))
                for m in line_closes: events.append((m.start(), 'close'))
                events.sort()
                
                for pos, type in events:
                    if type == 'open':
                        stack.append(line_no)
                    else:
                        if stack:
                            stack.pop()
                        else:
                            print(f"  ERROR: Closing </{tag}> on line {line_no} has no opener!")
            
            if stack:
                print(f"  ERROR: {len(stack)} <{tag}> tags never closed! Last opened on lines: {stack[-5:]}")

check_tags(r'c:\Users\m\OneDrive\Desktop\graduatedproject\ai-edu-platform\src\pages\HomePage.jsx')
