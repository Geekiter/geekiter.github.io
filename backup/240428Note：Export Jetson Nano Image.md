
after you feel that your nano system is mature, takes out your sd card from nano
insert your sd card to a nano reader
Go to Ubuntu linux system (can be virtual environment with large enough space for image file)
follow the following command to burn your sd card to an image file

1. sudo su
2. sudo parted -l
3. sudo parted /dev/sdb
 -> unit s
 -> print free
4. record last free number (60546876) (the first number in Free Space)
5. cd to the desktop location (cd /home/integem/Desktop)
6. sudo dd if=/dev/sdb count=60546876 | gzip > ./jetson-nano.img.gz

7. to see progress: sudo watch -n 5 pkill -USR1 -n -x dd

5. use usb drive to copy out the jetson-nano.img.gz file and upload into one drive 