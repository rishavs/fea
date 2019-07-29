import strformat

proc get_code_text(fileContent: string):string =
    var code            = ""
    var line_num        = 1
    var i               = 0
    var code_block_open = false
    let file_length = fileContent.len

    while i < file_length-3: # this is to ensure that the lokahead doesnt goes out of bounds
        # We may need line nums later for error messaging
        if fileContent[i] == '\n':
            line_num = line_num + 1

        if fileContent[i] == '`' and fileContent[i+1] == '`' and fileContent[i+2] == '`':
            code_block_open = not code_block_open
            i = i + 3

        if code_block_open:
            code.add($fileContent[i])

        i = i + 1

    return code
            
let codetext = get_code_text(readFile("main.fea"))


proc tokenize(codetext:string) =
    var program = ["SOP"]
    echo codetext
    
tokenize(codetext)

# break into lines, then words (strip whitespace_) then tokens (break into chars), then parse token and analyze

# if NL * ``` -> BOC
# if NL * anychars * ``` - > raise error
# if 


# let parser = 

# atoms
#   EOL, whitespace, type_assigner, value_assigner/atom?, COnst_name, block assigner