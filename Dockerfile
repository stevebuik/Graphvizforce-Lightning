FROM circleci/openjdk

RUN sudo apt-get update

RUN curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

RUN curl -L -o /tmp/google-chrome.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN sudo apt-get install -y libappindicator3-1 fonts-liberation libxss1 xdg-utils
RUN sudo dpkg -i /tmp/google-chrome.deb
RUN sudo sed -i 's|HERE/chrome\"|HERE/chrome\" --disable-setuid-sandbox|g' /opt/google/chrome/google-chrome

RUN sudo npm install -g sfdx-cli

# give circleci user write access to sfdx dirs for selenium run
RUN sudo chown -R circleci /usr/lib/node_modules/sfdx-cli
RUN ls -la /usr/lib/node_modules/sfdx-cli

