package com.hireorbit.resumeanalyzer.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class LatexCompilerService {

    public byte[] compileLatexToPdf(String latexCode) throws IOException, InterruptedException {
        Path tempDir = Files.createTempDirectory("tectonic_build");
        File texFile = new File(tempDir.toFile(), "resume.tex");
        File pdfFile = new File(tempDir.toFile(), "resume.pdf");

        try {
            Files.writeString(texFile.toPath(), latexCode);

            ProcessBuilder pb = new ProcessBuilder("tectonic", texFile.getAbsolutePath());
            pb.directory(tempDir.toFile());
            Process process = pb.start();
            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new RuntimeException("Tectonic compilation failed with exit code: " + exitCode);
            }

            return Files.readAllBytes(pdfFile.toPath());
        } finally {
            // Clean up temp directory
            File[] files = tempDir.toFile().listFiles();
            if (files != null) {
                for (File f : files) {
                    f.delete();
                }
            }
            tempDir.toFile().delete();
        }
    }
}
