# Package

version       = "0.1.0"
author        = "Rishav Sharan"
description   = "A PEG parser for Fea"
license       = "MIT"
srcDir        = "src"
bin           = @["fea"]



# Dependencies

requires "nim >= 0.20.0"
requires "npeg >= 0.12.0"

task dev, "Runs the test suite":
    exec "nim c -r src/fea.nim"