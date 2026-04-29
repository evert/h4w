Homelab for workgroups
----------------------

I wanted a 'homepage' for various self-hosted services. There were a bunch of
existing offerings, but I was missing some personality and whimsy from them.

Not being a designer myself, I decided to make my own but copy from a favourite
windows era.

Screenshot
-----------

<img src="/screenshots/v0.0.2.png" alt="Screenshot of the homepage" />

Getting started
----------------

### Node.js

```sh
# Clone this repo
git clone git@github.com:evert/hl4wg.git

# Go into the repository
cd hl4wg

# Install dependencies
npm install

# Copy example config
cp -R example-data/ data/

# Run
npm start
```


### docker-compose

TODO


Credits
-------

* Microsoft for the inspiration and memories
* [Windows 3.1 System Font reproduction by BroDadi](https://fontstruct.com/fontstructions/show/2574998/system-font-from-windows-3-1)
* [MS Sans-serif raster reproduction by CTFonts](https://fontstruct.com/fontstructions/show/2096359/ms-sans-serif-1-1)
* [Windows 3.1 icon collection by mRB0](https://github.com/mRB0/many-windows-3.1-icons-in-png-format)
