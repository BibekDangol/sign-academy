import os
import glob

directory = r"d:\FYP\Sign-Academy\frontend\src\pages"
files = glob.glob(os.path.join(directory, "*.jsx"))

for file_path in files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_content = content.replace("import Footer from './footer1';", "import Footer from './Footer';")
    new_content = new_content.replace('import Footer from "./footer1";', 'import Footer from "./Footer";')

    if content != new_content:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated {file_path}")

