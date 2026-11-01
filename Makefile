.PHONY: build test check serve clean

build:
	mayc main.may -o maysite

test: build
	may test

check: build
	./maysite check

serve: build
	./maysite serve 8000

clean:
	rm -rf build .may maysite
