#!/bin/bash

# 1. Generate SSH key for personal account
echo "Generating SSH key for osmanthegreat..."
# Using a placeholder email, user can change it or we can ask for it. 
# For now I'll use a generic one or ask the user to input it.
# Actually, I'll use the one from the previous turn if I knew it, but I don't.
# I'll ask for it in the script.

read -p "Enter email for osmanthegreat GitHub account: " email
ssh-keygen -t ed25519 -C "$email" -f ~/.ssh/id_ed25519_osmanthegreat -N ""

# 2. Start ssh-agent
eval "$(ssh-agent -s)"

# 3. Add key to ssh-agent
ssh-add --apple-use-keychain ~/.ssh/id_ed25519_osmanthegreat

# 4. Create/Update config file
CONFIG_FILE=~/.ssh/config
touch $CONFIG_FILE

# Check if entry already exists to avoid duplication
if ! grep -q "Host github.com-osmanthegreat" "$CONFIG_FILE"; then
    echo "" >> $CONFIG_FILE
    echo "Host github.com-osmanthegreat" >> $CONFIG_FILE
    echo "  HostName github.com" >> $CONFIG_FILE
    echo "  User git" >> $CONFIG_FILE
    echo "  IdentityFile ~/.ssh/id_ed25519_osmanthegreat" >> $CONFIG_FILE
    echo "  UseKeychain yes" >> $CONFIG_FILE
    echo "  AddKeysToAgent yes" >> $CONFIG_FILE
    echo "Config added to $CONFIG_FILE"
else
    echo "Config entry already exists in $CONFIG_FILE"
fi

# 5. Display public key
echo ""
echo "----------------------------------------------------------------------"
echo "COPY THE FOLLOWING KEY TO GITHUB:"
echo "https://github.com/settings/ssh/new"
echo "----------------------------------------------------------------------"
cat ~/.ssh/id_ed25519_osmanthegreat.pub
echo "----------------------------------------------------------------------"
