add:
	@ echo "\n> Make a new view + partial + route"
	@ echo "${view}";
	@ echo $(MAKECMDGOALS);

install:
	@ echo "\n> Install bower dependencies"
	@ bower install --quiet
	@ echo "> Install npm dependencies"
	@ npm install --quiet
	@ mkdir build
	@ cp -r app/components/ build/
	@ echo "> You can."