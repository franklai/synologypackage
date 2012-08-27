#!/bin/sh
# Copyright is Copyright
#

SPK_FILE="DivXPlayer.spk"

make()
{
	if [ -f "$SPK_FILE" ]; then
		echo "$SPK_FILE" already exists
		exit 1
	fi
	
	rm -rf _spk_dst
	mkdir _spk_dst
	mkdir _spk_dst/scripts

	rm -rf _package_dst
	mkdir _package_dst
	
	cp -af ui _package_dst/
	echo "== Compress to package.tgz"
	cd _package_dst/
	tar vzcf ../_spk_dst/package.tgz *
	cd ..

	cp -af INFO _spk_dst/
	cp -af package/scripts/* _spk_dst/scripts
	cp -af ui/images/player_72.png _spk_dst/PACKAGE_ICON.PNG

	echo "== Compress to $SPK_FILE"
	cd _spk_dst/
	tar vcf ../"$SPK_FILE" *
	cd ..
}

rm_rf()
{
	local path="$1"
	
	echo "Remove $path"
	rm -rf "$path"
}

make_clean()
{
	rm_rf "$SPK_FILE"
	rm_rf "_spk_dst"
	rm_rf "_package_dst"
}

case $1 in
	clean)
		make_clean
	;;
	*)
		make
	;;
esac
