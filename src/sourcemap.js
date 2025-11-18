/**
 * Source Map VLQ Encoding/Decoding utilities for Skulpt
 * 
 * This module provides VLQ (Variable Length Quantity) encoding and decoding
 * for generating source maps that map compiled JavaScript back to Python source.
 */

/**
 * Base64 VLQ encoding characters
 */
const VLQ_BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const VLQ_BASE_SHIFT = 5;
const VLQ_BASE = 1 << VLQ_BASE_SHIFT; // 32
const VLQ_BASE_MASK = VLQ_BASE - 1;   // 31
const VLQ_CONTINUATION_BIT = VLQ_BASE; // 32

/**
 * Encode a single integer value as VLQ
 * @param {number} value - The value to encode (can be negative)
 * @returns {string} VLQ encoded string
 */
function encodeVLQValue(value) {
    let encoded = '';
    
    // Convert to unsigned with sign bit
    let vlq = value < 0 ? ((-value) << 1) + 1 : value << 1;
    
    do {
        let digit = vlq & VLQ_BASE_MASK;
        vlq >>>= VLQ_BASE_SHIFT;
        
        if (vlq > 0) {
            digit |= VLQ_CONTINUATION_BIT;
        }
        
        encoded += VLQ_BASE64_CHARS[digit];
    } while (vlq > 0);
    
    return encoded;
}

/**
 * Decode a VLQ encoded string to an integer
 * @param {string} encoded - VLQ encoded string
 * @param {number} startIndex - Starting position in the string
 * @returns {{value: number, length: number}} Decoded value and number of characters consumed
 */
function decodeVLQValue(encoded, startIndex) {
    let result = 0;
    let shift = 0;
    let continuation = true;
    let index = startIndex;
    
    while (continuation) {
        if (index >= encoded.length) {
            throw new Error('Invalid VLQ encoding: unexpected end of string');
        }
        
        const char = encoded[index++];
        const digit = VLQ_BASE64_CHARS.indexOf(char);
        
        if (digit === -1) {
            throw new Error('Invalid VLQ encoding: invalid character');
        }
        
        continuation = (digit & VLQ_CONTINUATION_BIT) !== 0;
        result += (digit & VLQ_BASE_MASK) << shift;
        shift += VLQ_BASE_SHIFT;
    }
    
    // Convert from unsigned with sign bit back to signed
    const negative = (result & 1) === 1;
    result >>>= 1;
    
    return {
        value: negative ? -result : result,
        length: index - startIndex
    };
}

/**
 * Source map generator for tracking Python source to JavaScript mappings
 */
function SourceMapGenerator(filename, sourceCode) {
    this.filename = filename;
    this.sourceCode = sourceCode;
    this.sourceLines = sourceCode ? sourceCode.split('\n') : [];
    this.mappings = [];
    this.lastGenLine = 0;
    this.lastGenCol = 0;
    this.lastSourceLine = 0;
    this.lastSourceCol = 0;
}

/**
 * Add a mapping from generated position to source position
 * @param {number} genLine - Generated code line (0-based)
 * @param {number} genCol - Generated code column (0-based)
 * @param {number} sourceLine - Source code line (0-based)
 * @param {number} sourceCol - Source code column (0-based)
 */
SourceMapGenerator.prototype.addMapping = function(genLine, genCol, sourceLine, sourceCol) {
    this.mappings.push({
        genLine: genLine,
        genCol: genCol,
        sourceLine: sourceLine,
        sourceCol: sourceCol
    });
};

/**
 * Generate VLQ encoded mappings string
 * @returns {string} VLQ encoded mappings
 */
SourceMapGenerator.prototype.generateMappings = function() {
    // Sort mappings by generated position
    this.mappings.sort(function(a, b) {
        if (a.genLine !== b.genLine) {
            return a.genLine - b.genLine;
        }
        return a.genCol - b.genCol;
    });
    
    let result = '';
    let lastGenLine = 0;
    let lastGenCol = 0;
    let lastSourceLine = 0;
    let lastSourceCol = 0;
    
    for (let i = 0; i < this.mappings.length; i++) {
        const mapping = this.mappings[i];
        
        // Add semicolons for line breaks
        while (lastGenLine < mapping.genLine) {
            result += ';';
            lastGenLine++;
            lastGenCol = 0;
        }
        
        // Add comma separator between segments on same line
        if (result.length > 0 && result[result.length - 1] !== ';') {
            result += ',';
        }
        
        // Encode the mapping segment (4 fields):
        // 1. Generated column delta
        result += encodeVLQValue(mapping.genCol - lastGenCol);
        // 2. Source file index (always 0 for single file)
        result += encodeVLQValue(0);
        // 3. Source line delta
        result += encodeVLQValue(mapping.sourceLine - lastSourceLine);
        // 4. Source column delta
        result += encodeVLQValue(mapping.sourceCol - lastSourceCol);
        
        lastGenCol = mapping.genCol;
        lastSourceLine = mapping.sourceLine;
        lastSourceCol = mapping.sourceCol;
    }
    
    return result;
};

/**
 * Get source line by line number (1-based)
 * @param {number} lineNo - Line number (1-based)
 * @returns {string} Source line or empty string
 */
SourceMapGenerator.prototype.getSourceLine = function(lineNo) {
    if (!this.sourceLines || lineNo < 1 || lineNo > this.sourceLines.length) {
        return '';
    }
    return this.sourceLines[lineNo - 1];
};

/**
 * Generate complete source map object
 * @returns {Object} Source map object
 */
SourceMapGenerator.prototype.toJSON = function() {
    return {
        version: 3,
        file: this.filename + '.js',
        sourceRoot: '',
        sources: [this.filename],
        sourcesContent: [this.sourceCode],
        names: [],
        mappings: this.generateMappings()
    };
};

// Export for use in Skulpt
if (typeof Sk === 'undefined') {
    Sk = {};
}
if (!Sk.sourcemap) {
    Sk.sourcemap = {
        SourceMapGenerator: SourceMapGenerator,
        encodeVLQValue: encodeVLQValue,
        decodeVLQValue: decodeVLQValue
    };
}
