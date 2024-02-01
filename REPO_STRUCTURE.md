# Structure of the main library of JClic projects

Projects are hosted in:<br/>
https://clic.xtec.cat/projects

Each project has a subdirectory in this root structure. For example, the "demo" project is located in:<br/>
https://clic.xtec.cat/projects/demo

Some projects can have subprojects. For example, the "cs18" module of the [Andrómeda](https://projectes.xtec.cat/clic/ca/repo/?text=andr%C3%B3meda&subject=soc) project resides in:<br/>
https://clic.xtec.cat/projects/androcs/cs18

The full list of projects is always here:<br/>
https://clic.xtec.cat/projects/projects.json

The list is an array of objects. The main fields of these objects are:

- __path__: The subirectory of the root repository where this project resides, as previously seen.
- __title__: The main title of the project
- __author__: The author or authors of this project, separed by comma.
- __date__: The publication date, in format `DD/MM/YY`.
- __langCodes__: An array of [ISO-639](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) two-letter language codes.
- __levelCodes__: An array of one or more tags from this list of possible values:
  - __INF__: Kindergarten (3-6)
  - __PRI__: Primary school (6-12)
  - __SEC__: Secondary school (12-16)
  - __BTX__: High school (16-18)
- __areaCodes__: An array of one or more tags from this list of possible values:
  - __lleng__: Languages
  - __mat__: Mathematics
  - __soc__: Social sciences
  - __exp__: Experimental sciences
  - __mus__: Music
  - __vip__: Art & design
  - __ef__: Physical education
  - __tec__: Design & technology
  - __div__: Miscellaneous
- __mainFile__: The main ".jclic" (XML) or ".jclic.json" file, used by [JClic.js](https://projectestac.github.io/jclic.js/) to launch this project. The path of this file is always relative to the location of the project.
- __cover__: The cover image of this project, usually at 300 pixels width, in PNG or JPG format.
- __coverWebp__: The same cover, in [WebP](https://en.wikipedia.org/wiki/WebP) format.
- __thumbnail__: Small version of the cover image, usually at 100 pixels width.

This is a just a short version of the metadata of each project. The full metadata is located in a file named `project.json`, at the root of the project subdirectory. For example:<br/>
https://clic.xtec.cat/projects/demo/project.json

In addition to this metadata file, there is also another file named `all-words.txt`, with all the words that appear both in the activities and in the project description. For example:<br/>
https://clic.xtec.cat/projects/demo/all-words.txt<br/>
WARNING: This file is encoded in UTF-8, but the server currently uses ISO-8859

The main web page of the repository is available in three languages: Catalan (ca), Spanish (es) and English (en) at:<br/>
https://projectes.xtec.cat/clic/ca/repo<br/>
https://projectes.xtec.cat/clic/es/repo<br/>
https://projectes.xtec.cat/clic/en/repo<br/>

The URL of the page corresponding to each project is formed by adding `?prj=path` to these URLs. For example, the "demo" project is shown in:
https://projectes.xtec.cat/clic/ca/repo/?prj=demo<br/>
https://projectes.xtec.cat/clic/es/repo/?prj=demo<br/>
https://projectes.xtec.cat/clic/en/repo/?prj=demo<br/>

