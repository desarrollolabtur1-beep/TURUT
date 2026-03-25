---
description: Stage all changes, ask for a commit message, and commit to the repository
---

This workflow helps stage your changes, write a descriptive commit message, and commit them to the repository.

1. Check the current Git status to see what files have been modified.
```bash
git status
```

2. Add all modified, deleted, and new files to the staging area.
// turbo
```bash
git add .
```

3. Ask the user for a commit message describing the changes they made. Alternatively, if you have enough context on the changes made, you can generate a short, descriptive commit message and ask the user to confirm if it is acceptable.

4. Once the commit message is confirmed, formulate a `run_command` to commit the changes. Substitute `<MESSAGE>` with the actual message.
```bash
git commit -m "<MESSAGE>"
```

5. Check the git status again to ensure the working tree is clean and the commit was successful.
// turbo
```bash
git status
```

6. Ask the user if they would also like to push the changes to the remote repository. If yes, run the following command (adjusting the branch as necessary, e.g., `main` or `master`):
```bash
git push origin main
```
