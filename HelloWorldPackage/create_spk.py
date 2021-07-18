#!/usr/bin/env python3
from contextlib import contextmanager
import json
import logging
import os
import sys
import tarfile

package_src_dir = "package_src"
spk_src_dir = "spk_src"
package_tgz_name = "package.tgz"
current_dir = os.path.dirname(__file__)
ui_dir = os.path.join(current_dir, package_src_dir, "ui")
package_scripts_dir = os.path.join(current_dir, spk_src_dir, "scripts")
info_path = os.path.join(current_dir, spk_src_dir, "INFO")
icon_dir = os.path.join(ui_dir, "images")
icon_path = os.path.join(icon_dir, "hello_72.png")
icon256_path = os.path.join(icon_dir, "hello_256.png")


def tar_reset(tarinfo):
    tarinfo.uid = tarinfo.gid = 99
    tarinfo.uname = tarinfo.gname = "nobody"
    return tarinfo


def read_name_ane_version():
    version = "0.0.0-0000"
    name = "Unknown"

    for line in open(info_path, "r"):
        if line.startswith("version="):
            items = line.split('"')
            version = items[1]
            continue
        if line.startswith("package="):
            items = line.split('"')
            name = items[1]
            continue
    return [name, version]


def create_package_tgz(dist_dir_path):
    package_tgz_path = os.path.join(dist_dir_path, package_tgz_name)
    with tarfile.open(package_tgz_path, "w:gz") as tar:
        tar.add(ui_dir, arcname=os.path.basename(ui_dir), filter=tar_reset)

        print("create package.tgz {}".format(package_tgz_path))
        print("including:")
        print("\t{}".format(ui_dir))
    return package_tgz_path


def create_spk(dist_dir_path, tgz_path):
    name, version = read_name_ane_version()

    spk_name = "{}-{}.spk".format(name, version)
    spk_path = os.path.join(dist_dir_path, spk_name)
    with tarfile.open(spk_path, "w:gz") as tar:
        tar.add(tgz_path, arcname=os.path.basename(tgz_path), filter=tar_reset)
        tar.add(info_path, arcname=os.path.basename(info_path), filter=tar_reset)
        tar.add(package_scripts_dir, arcname=os.path.basename(package_scripts_dir), filter=tar_reset)
        tar.add(icon_path, arcname="PACKAGE_ICON.PNG", filter=tar_reset)
        tar.add(icon256_path, arcname="PACKAGE_ICON_256.PNG", filter=tar_reset)

        print("create spk {}".format(spk_path))


def do_tar(dist_dir_path):
    tgz_path = create_package_tgz(dist_dir_path)
    create_spk(dist_dir_path, tgz_path)


def print_usage():
    print("%s [dist dir path]\n" % (os.path.basename(__file__)))

    sys.exit(0)


if __name__ == "__main__":
    argv = sys.argv

    if len(argv) < 2:
        print_usage()
        sys.exit(-1)

    dist_dir_path = argv[1]
    if not os.path.exists(dist_dir_path):
        print("path {} not exists".format(dist_dir_path))
        sys.exit(-1)

    do_tar(os.path.abspath(dist_dir_path))
