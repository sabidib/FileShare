#!/Users/samy/Library/Enthought/Canopy_64bit/User/bin/python
#!/usr/bin/python

import sys;
import os;
import subprocess;
import simplejson as json;
from optparse import OptionParser;

compiler_jar_location = "compiler/compiler.jar";
divider_string = "-"*(int(60));

def cmd(args):
	proc = subprocess.Popen(args,stdout=subprocess.PIPE, stderr = subprocess.PIPE, shell=True);
	out,err = proc.communicate();
	return [out,err];

def compileBaseSource(minify):
	source_file_path = "../../includes/";
	final_minimized_build_location = "../../includes/FileShare.min.js"
	final_build_location = "../../build/FileShare.js"
	compiler_jar_location = "compiler/compiler.jar";

	print "";
	print "Loading source file order from source_order.cfg";

	with open('source_order.cfg','r') as f:
		data = json.load(f);

	final_build_location_file = open(final_build_location,"w");  
	print "    Appending sources to " + final_build_location;
	for file_name in data:
		path = source_file_path + file_name.rstrip();
		
		print "        Appending source from: " + path;
		with open(path) as f:
			final_build_location_file.write(f.read());
		final_build_location_file.write("\n");
 	final_build_location_file.close();


	print "";
	print "Compiling " + final_build_location +  " into " + final_minimized_build_location;

	command = "java -jar " + compiler_jar_location + " " + final_build_location + " --warning_level=QUIET --compilation_level SIMPLE_OPTIMIZATIONS "+ " --language_in=ECMASCRIPT5_STRICT " +   " --js_output_file " + final_minimized_build_location;
	print "    " + command;
	if(minify):
		java_output = cmd(command);
		
		if(java_output[1] != ""):
			print ""
			print "Error :"
			print "";
			sys.stderr.write(java_output[1] + '\n');
			print "Cleaning up";
			open(final_build_location,"w").close();
			print "";
			print  java_output[0];
			sys.exit(1);
	print ""


def parseArgs(argv):
	parser = OptionParser();
	parser.add_option("-m", "--minify", action="store_true", default=False, dest="minify",help="minify the output.");
	options,args = parser.parse_args(argv);
	return options;


def main(argv):
	os.chdir(os.path.dirname(sys.argv[0]))
	options = parseArgs(argv);
	
	#Keep this true to actually compile!
	base = True;

	minify = options.minify;

	#
	##
	###
	# Starting Build
	###
	##
	#

	print "";
	print "Starting Build";
	print "";

	print divider_string
	
	##################################################
	################# Base Source ####################
	if(base):
		print "Compiling Source"
		compileBaseSource(minify = minify);


	print divider_string


	print "Cleaning up";
	print ""
	print "Done";
	print "";
	sys.exit(0);

	#
	##
	###
	# Ending Build
	###
	##
	#


if __name__ == "__main__":
	main(sys.argv[1:]);
