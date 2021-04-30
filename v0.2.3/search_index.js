var documenterSearchIndex = {"docs":
[{"location":"genes/#Filtering:-the-@genes-macro-1","page":"Filtering: the @genes macro","title":"Filtering: the @genes macro","text":"","category":"section"},{"location":"genes/#","page":"Filtering: the @genes macro","title":"Filtering: the @genes macro","text":"A useful tool provided by GenomicAnnotations is the macro @genes. It is used to filter through annotations, for example to look at only at coding sequences or rRNAs, which can then be modified or iterated over:","category":"page"},{"location":"genes/#","page":"Filtering: the @genes macro","title":"Filtering: the @genes macro","text":"# Print locus tags of all coding sequences longer than 1000 nt, that are not pseudo genes\nfor gene in @genes(chr, CDS, length(gene) > 1000, ! :pseudo)\n    println(gene.locus_tag)\nend","category":"page"},{"location":"genes/#","page":"Filtering: the @genes macro","title":"Filtering: the @genes macro","text":"@genes","category":"page"},{"location":"genes/#GenomicAnnotations.@genes","page":"Filtering: the @genes macro","title":"GenomicAnnotations.@genes","text":"@genes(chr, exs...)\n\nIterate over and evaluate expressions in exs for all genes in chr.genes, returning genes where all expressions evaluate to true. Any given symbol s in the expression will be substituted for gene.s. The gene itself can be accessed in the expression as gene. Accessing properties of the returned list of genes returns a view, which can be altered.\n\nSymbols and expressions escaped with Ref() will be ignored.\n\nSome short-hand forms are available to make life easier:     CDS, rRNA, and tRNA expand to feature(gene) == \"...\",     get(s::Symbol, default) expands to get(gene, s, default)\n\nExamples\n\njulia> chromosome = readgbk(\"example.gbk\")\nChromosome 'example' (5028 bp) with 6 annotations\n\njulia> @genes(chromosome, iscds) |> length\n3\n\njulia> @genes(chromosome, length(gene) < 500)\n     CDS             3..206\n                     /db_xref=\"GI:1293614\"\n                     /locus_tag=\"tag01\"\n                     /codon_start=\"3\"\n                     /product=\"TCP1-beta\"\n                     /protein_id=\"AAA98665.1\"\n\njulia> @genes(chromosome, ismissing(:gene)) |> length\n2\n\njulia> @genes(chromosome, ismissing(:gene)).gene .= \"Unknown\";\n\njulia> @genes(chromosome, ismissing(:gene)) |> length\n0\n\nAll arguments have to evaluate to true for a gene to be included, so the following expressions are equivalent:\n\n@genes(chr, feature(gene) == Ref(:CDS), length(gene) > 300)\n@genes(chr, (feature(gene) == Ref(:CDS)) && (length(gene) > 300))\n\n@genes returns a Vector{Gene}. Attributes can be accessed with dot-syntax, and can be assigned to\n\n@genes(chr, :locus_tag == \"tag03\")[1].pseudo = true\n@genes(chr, CDS, ismissing(:gene)).gene .= \"unknown\"\n\n\n\n\n\n","category":"macro"},{"location":"examples/#Examples-1","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/#Adding-chromosome-name-to-all-locus-tags-1","page":"Examples","title":"Adding chromosome name to all locus tags","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"When iterating over genes, the parent chromosome can be accessed with parent(::Gene).","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using GenomicAnnotations\nchrs = readgbk(\"genome.gbk\")\nfor gene in @genes(chrs)\n    gene.locus_tag = string(parent(gene).name, \"_\", gene.locus_tag)\nend\nprintgbk(\"updated_genome.gbk\", chrs)","category":"page"},{"location":"examples/#Adding-qualifiers-1","page":"Examples","title":"Adding qualifiers","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"GenomicAnnotations supports arbitrary qualifiers, so you can add any kind of information. The following script reads and adds the output from Phobius (a predictor for transmembrane helices) to the annotations.","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using GenomicAnnotations\nchrs = readgbk(\"genome.gbk\")\n\nfunction addphobius!(chr, file)\n    @progress for line in readlines(file)\n        m = match(r\"^(\\w+) +(\\d+) +\", line)\n        if m != nothing\n            locus_tag = m[1]\n            tmds = parse(Int, m[2])\n            @genes(chr, CDS, :locus_tag == locus_tag).phobius .= tmds\n        end\n    end\nend\n\naddphobius!(chrs, \"phobius.txt\")\n\nopen(GenBank.Writer, \"updated_genome.gbk\") do w\n    for chr in chrs\n        write(w, chr)\n    end\nend","category":"page"},{"location":"examples/#Converting-between-formats-1","page":"Examples","title":"Converting between formats","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"Note that GenBank and GFF3 headers do not contain the same information, thus all information in the header is lost when saving annotations as another format.","category":"page"},{"location":"examples/#","page":"Examples","title":"Examples","text":"using GenomicAnnotations\nchrs = readgbk(\"genome.gbk\")\nopen(GFF.Writer, \"genome.gff\") do w\n    for chr in chrs\n        write(w, chr)\n    end\nend","category":"page"},{"location":"accessing/#Accessing-and-modifying-annotations-1","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"","category":"section"},{"location":"accessing/#Feature-1","page":"Accessing and modifying annotations","title":"Feature","text":"","category":"section"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Features (genes) can be added using addgene!. A feature must have a feature name and a locus (position), and can have any number of additional qualifiers associated with it (see next section).","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"addgene!","category":"page"},{"location":"accessing/#GenomicAnnotations.addgene!","page":"Accessing and modifying annotations","title":"GenomicAnnotations.addgene!","text":"addgene!(chr::Record, feature, locus; kw...)\n\nAdd gene to chr. locus can be a Locus, a UnitRange, or a StepRange (for decreasing ranges, which will be annotated on the complementary strand).\n\nExample\n\naddgene!(chr, \"CDS\", 1:756;\n    locus_tag = \"gene0001\",\n    product = \"Chromosomal replication initiator protein dnaA\")\n\n\n\n\n\n","category":"function"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"After adding a new feature, sort! can be used to make sure that the annotations are stored (and printed) in the order in which they occur on the chromosome:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"sort!(chr)","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Existing features can be removed using delete!:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"delete!(::Gene)\ndelete!(::AbstractVector{Gene})","category":"page"},{"location":"accessing/#Base.delete!-Tuple{Gene}","page":"Accessing and modifying annotations","title":"Base.delete!","text":"delete!{T}(h::MutableBinaryHeap{T}, i::Int)\n\nDeletes the element with handle i from heap h .\n\n\n\n\n\ndelete!(collection, key)\n\nDelete the mapping for the given key in a collection, and return the collection.\n\nExamples\n\njulia> d = RobinDict(\"a\"=>1, \"b\"=>2)\nRobinDict{String,Int64} with 2 entries:\n  \"b\" => 2\n  \"a\" => 1\n\njulia> delete!(d, \"b\")\nRobinDict{String,Int64} with 1 entry:\n  \"a\" => 1\n\n\n\n\n\ndelete!(tree::RBTree, key)\n\nDeletes key from tree, if present, else returns the unmodified tree.\n\n\n\n\n\ndelete!(gene::AbstractGene)\n\nDelete gene from parent(gene). Warning: does not work when broadcasted! Use delete!(::AbstractVector{Gene}) instead.\n\n\n\n\n\n","category":"method"},{"location":"accessing/#Base.delete!-Tuple{AbstractArray{Gene,1}}","page":"Accessing and modifying annotations","title":"Base.delete!","text":"delete!(genes::AbstractArray{Gene, 1})\n\nDelete all genes in genes from parent(genes[1]).\n\nExample\n\ndelete!(@genes(chr, length(gene) <= 60))\n\n\n\n\n\n","category":"method"},{"location":"accessing/#Qualifiers-1","page":"Accessing and modifying annotations","title":"Qualifiers","text":"","category":"section"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Features can have multiple qualifiers, which can be modified using Julia's property syntax:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"# Remove newspace from gene product descriptions\nfor gene in @genes(chr, CDS)\n    replace!(gene.product, '\\n' => ' ')\nend","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Properties also work on views of genes, typically generated using @genes:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"interestinggenes = readlines(\"/path/to/list/of/interesting/genes.txt\")\n@genes(chr, CDS, :locus_tag in interestinggenes).interesting .= true","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Sometimes features have multiple instances of the same qualifier, such genes having several EC-numbers. Assigning qualifiers with property syntax overwrites any data that was previously stored for that feature, and trying to assign a vector of values to a qualifier that is currently storing scalars will result in an error, so to safely assign qualifiers that might have more instances one can use pushproperty!:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"pushproperty!","category":"page"},{"location":"accessing/#GenomicAnnotations.pushproperty!","page":"Accessing and modifying annotations","title":"GenomicAnnotations.pushproperty!","text":"pushproperty!(gene::AbstractGene, qualifier::Symbol, value::T)\n\nAdd a property to gene, similarly to Base.setproperty!(::gene), but if the property is not missing in gene, it will be transformed to store a vector instead of overwriting existing data.\n\njulia> eltype(chr.genedata[!, :EC_number])\nUnion{Missing,String}\n\njulia> chr.genes[1].EC_number = \"EC:1.2.3.4\"\n\"EC:1.2.3.4\"\n\njulia> pushproperty!(chr.genes[1], :EC_number, \"EC:4.3.2.1\"); chr.genes[1].EC_number\n2-element Array{String,1}:\n \"EC:1.2.3.4\"\n \"EC:4.3.2.1\"\n\njulia> eltype(chr.genedata[!, :EC_number])\nUnion{Missing, Array{String,1}}\n\n\n\n\n\n","category":"function"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"Accessing properties that haven't been stored will return missing. For this reason, it often makes more sense to use get() than to access the property directly.","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"# chr.genes[2].pseudo returns missing, so this will throw an error\nif chr.genes[2].pseudo\n    println(\"Gene 2 is a pseudogene\")\nend\n\n# ... but this works:\nif get(chr.genes[2], :pseudo, false)\n    println(\"Gene 2 is a pseudogene\")\nend","category":"page"},{"location":"accessing/#Sequences-1","page":"Accessing and modifying annotations","title":"Sequences","text":"","category":"section"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"The sequence of a Chromosome chr is stored in chr.sequence. Sequences of individual features can be read with sequence:","category":"page"},{"location":"accessing/#","page":"Accessing and modifying annotations","title":"Accessing and modifying annotations","text":"sequence(::Gene)","category":"page"},{"location":"accessing/#GenomicAnnotations.sequence-Tuple{Gene}","page":"Accessing and modifying annotations","title":"GenomicAnnotations.sequence","text":"sequence(gene::AbstractGene; translate = false)\n\nReturn genomic sequence for gene. If translate is true, the sequence will be translated to a LongAminoAcidSeq, excluding the stop, otherwise it will be returned as a LongDNASeq (including the stop codon). ```\n\n\n\n\n\n","category":"method"},{"location":"#GenomicAnnotations.jl-1","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"","category":"section"},{"location":"#Description-1","page":"GenomicAnnotations.jl","title":"Description","text":"","category":"section"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"GenomicAnnotations is a package for reading, modifying, and writing genomic annotations in the GenBank and GFF3 file formats.","category":"page"},{"location":"#Installation-1","page":"GenomicAnnotations.jl","title":"Installation","text":"","category":"section"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"julia>]\npkg> add GenomicAnnotations","category":"page"},{"location":"#Examples-1","page":"GenomicAnnotations.jl","title":"Examples","text":"","category":"section"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"GenBank and GFF3 files are read with readgbk(input) and readgff(input), which return vectors of Records. input can be an IOStream or a file path. GZipped data can be read by setting the keyword gunzip to true, which is done automatically if a filename ending in \".gz\" is passed as input. If we're only interested in the first chromosome in example.gbk we only need to store the first record.","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"chr = readgbk(\"test/example.gbk\")[1]","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"Another way to read files is to use the corresponding Reader directly:","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"open(GenBank.Reader, \"test/example.gbk\") do reader\n    for record in reader\n        println(record.name)\n    end\nend","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"Records have five fields, name, header, genes, genedata, and sequence. The name is read from the header, which is stored as a string. The annotation data is stored in genedata, but generally you should use genes to access that data. For example, it can be used to iterate over annotations, and to modify them.","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"for gene in chr.genes\n    gene.locus_tag = \"$(chr.name)_$(gene.locus_tag)\"\nend\n\nchr.genes[2].locus_tag = \"test123\"","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"The macro @genes can be used to filter through the annotations (see @genes). The keyword gene is used to refer to the individual Genes. @genes can also be used to modify annotations.","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"@genes(chr, length(gene) > 300) # Returns all features longer than 300 nt","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"Gene sequences can be accessed with sequence(gene). For example, the following code will write the translated sequences of all protein-coding genes in chr to a file:","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"using BioSequences\nusing FASTX\nopen(FASTA.Writer, \"proteins.fasta\") do w\n    for gene in @genes(chr, CDS)\n        aaseq = GenomicAnnotations.sequence(gene; translate = true)\n        write(w, FASTA.Record(gene.locus_tag, get(:product, \"\"), aaseq))\n    end\nend","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"Genes can be added using addgene!, and sort! can be used to make sure that the resulting annotations are in the correct order for printing. delete! is used to remove genes.","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"newgene = addgene!(chr, \"regulatory\", 670:677)\nnewgene.locus_tag = \"reg02\"\nsort!(chr.genes)\n\n# Genes can be deleted. This works for all genes where `:pseudo` is `true`, and ignores genes where it is `false` or `missing`\ndelete!(@genes(chr, :pseudo))\n# Delete all genes 60 nt or shorter\ndelete!(@genes(chr, length(gene) <= 60))","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"Individual genes, and Vector{Gene}s are printed in GBK format. To include the GBK header and the nucleotide sequence, write(::GenBank.Writer, chr) can be used to write them to a file. Use GFF.Writer instead to print the annotations as GFF3, in which case the GenBank header is lost.","category":"page"},{"location":"#","page":"GenomicAnnotations.jl","title":"GenomicAnnotations.jl","text":"println(chr.genes[1])\nprintln(@genes(chr, CDS))\n\nopen(GenBank.Writer, \"updated.gbk\") do w\n    write(w, chr)\nend","category":"page"},{"location":"io/#I/O-1","page":"I/O","title":"I/O","text":"","category":"section"},{"location":"io/#Input-1","page":"I/O","title":"Input","text":"","category":"section"},{"location":"io/#","page":"I/O","title":"I/O","text":"Annotation files are read with GenBank.Reader and GFF.Reader. Currently these assume that the file follows either standard GenBank format, or GFF3. Any metadata in GFF3 files, apart from the header, is ignored.","category":"page"},{"location":"io/#","page":"I/O","title":"I/O","text":"open(GenBank.Reader, \"example.gbk\") do reader\n    for record in reader\n        do_something()\n    end\nend","category":"page"},{"location":"io/#","page":"I/O","title":"I/O","text":"readgbk(input) and readgff(input) are aliases for collect(open(GenBank.Reader, input)) and collect(open(GFF.Reader, input)), respectively.","category":"page"},{"location":"io/#","page":"I/O","title":"I/O","text":"GenBank.Reader\nGFF.Reader","category":"page"},{"location":"io/#GenomicAnnotations.GenBank.Reader","page":"I/O","title":"GenomicAnnotations.GenBank.Reader","text":"GenBank.Reader(input::IO)\n\nCreate a data reader of the GenBank file format.\n\n\n\n\n\n","category":"type"},{"location":"io/#GenomicAnnotations.GFF.Reader","page":"I/O","title":"GenomicAnnotations.GFF.Reader","text":"GFF.Reader(input::IO)\n\nCreate a data reader of the GFF3 file format.\n\n\n\n\n\n","category":"type"},{"location":"io/#Output-1","page":"I/O","title":"Output","text":"","category":"section"},{"location":"io/#","page":"I/O","title":"I/O","text":"Annotations can be printed with GenBank formatting using GenBank.Writer, and as GFF3 with GFF.Writer. Headers are not automatically converted between formats; GFF.Writer only prints the header of the first Record, and only if it starts with a #, while GenBank.Writer prints a default header if the stored one starts with #.","category":"page"},{"location":"io/#","page":"I/O","title":"I/O","text":"GenBank.Writer\nGFF.Writer","category":"page"},{"location":"io/#GenomicAnnotations.GenBank.Writer","page":"I/O","title":"GenomicAnnotations.GenBank.Writer","text":"GenBank.Writer(output::IO; width=70)\n\nCreate a data writer of the GenBank file format.\n\nopen(GenBank.Writer, outfile) do writer\n    write(writer, genome)\nend\n\n\n\n\n\n","category":"type"},{"location":"io/#GenomicAnnotations.GFF.Writer","page":"I/O","title":"GenomicAnnotations.GFF.Writer","text":"GFF.Writer(output::IO; width=70)\n\nCreate a data writer of the GFF file format.\n\nopen(GFF.Writer, outfile) do writer\n    write(writer, genome)\nend\n\n\n\n\n\n","category":"type"},{"location":"io/#","page":"I/O","title":"I/O","text":"In the REPL, instances of Gene are displayed as they would be in the annotation file.","category":"page"}]
}
