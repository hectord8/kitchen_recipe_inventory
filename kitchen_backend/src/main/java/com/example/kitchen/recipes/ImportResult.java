package com.example.kitchen.recipes;

public class ImportResult {
    private int inserted;
    private int skipped;

    public ImportResult() {}
    public ImportResult(int inserted, int skipped) {
        this.inserted = inserted;
        this.skipped = skipped;
    }

    public int getInserted() { return inserted; }
    public void setInserted(int inserted) { this.inserted = inserted; }

    public int getSkipped() { return skipped; }
    public void setSkipped(int skipped) { this.skipped = skipped; }
}
