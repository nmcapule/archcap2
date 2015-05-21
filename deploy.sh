echo -e "\33[0;32mDeploying updates to GitHub...\033[0m"

hugo

git add -A

msg="Rebuilding site `date`"
if [ $# -eq 1 ]
    then msg="$1"
fi
git commit -m "$msg"

git push origin master
git subtree push --prefix=public git@github.com:nmcapule/archcap2.git gh-pages
