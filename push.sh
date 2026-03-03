clear
git add .
git status
read -p "Enter commit message: " message
git commit -m "$message"
git push
